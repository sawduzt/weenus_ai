/**
 * HuggingFace Hub Service
 * 
 * Fetches GGUF models from HuggingFace Hub using their public API.
 */

export interface HuggingFaceModel {
  id: string; // e.g., "TheBloke/Llama-2-7B-GGUF"
  name: string; // Display name
  author: string;
  description?: string;
  downloads: number;
  likes: number;
  tags: string[];
  lastModified: string;
  // GGUF specific
  files?: HuggingFaceFile[];
  modelType?: 'text' | 'image' | 'video' | 'audio' | 'multimodal';
}

export interface HuggingFaceFile {
  filename: string;
  size: number;
  sizeDisplay: string;
  quantization?: string; // e.g., "Q4_K_M", "Q5_K_S"
  downloadUrl: string;
}

const HF_API_BASE = 'https://huggingface.co/api';

/**
 * Search for GGUF models on HuggingFace
 */
export async function searchModels(
  query: string = '',
  options: {
    limit?: number;
    sort?: 'downloads' | 'likes' | 'trending';
    modelType?: 'text' | 'image' | 'video' | 'all';
  } = {}
): Promise<HuggingFaceModel[]> {
  const { limit = 50, sort = 'downloads' } = options;

  try {
    // Build the search query
    const params = new URLSearchParams({
      search: query || 'gguf',
      limit: limit.toString(),
      sort: sort,
      filter: 'gguf', // Filter for GGUF models
    });

    // Add model type filter if specified
    if (options.modelType && options.modelType !== 'all') {
      params.append('pipeline_tag', getHFPipelineTag(options.modelType));
    }

    const response = await fetch(`${HF_API_BASE}/models?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform HF API response to our model format
    const models: HuggingFaceModel[] = data.map((model: any) => {
      const [author, ...nameParts] = model.id.split('/');
      
      return {
        id: model.id,
        name: nameParts.join('/'),
        author,
        description: model.cardData?.description || model.description,
        downloads: model.downloads || 0,
        likes: model.likes || 0,
        tags: model.tags || [],
        lastModified: model.lastModified || new Date().toISOString(),
        modelType: detectModelType(model.tags || [], model.pipeline_tag),
      };
    });

    return models;
  } catch (error) {
    console.error('Error searching HuggingFace models:', error);
    
    // Return popular GGUF models as fallback
    return getPopularGGUFModels();
  }
}

/**
 * Get files for a specific model
 */
export async function getModelFiles(modelId: string): Promise<HuggingFaceFile[]> {
  try {
    const response = await fetch(`${HF_API_BASE}/models/${modelId}/tree/main`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter for GGUF files and transform
    const ggufFiles = data
      .filter((file: any) => file.path.toLowerCase().endsWith('.gguf'))
      .map((file: any) => ({
        filename: file.path,
        size: file.size,
        sizeDisplay: formatFileSize(file.size),
        quantization: extractQuantization(file.path),
        downloadUrl: `https://huggingface.co/${modelId}/resolve/main/${file.path}`,
      }));

    return ggufFiles;
  } catch (error) {
    console.error('Error fetching model files:', error);
    return [];
  }
}

/**
 * Filter models by size
 */
export function filterBySize(
  models: HuggingFaceModel[],
  sizeFilter: 'all' | 'small' | 'medium' | 'large'
): HuggingFaceModel[] {
  if (sizeFilter === 'all') {
    return models;
  }

  // For HF models, we'll need to check the files
  // For now, we'll use a heuristic based on the model name
  return models.filter(model => {
    const sizeHint = model.name.toLowerCase();
    
    if (sizeFilter === 'small') {
      return sizeHint.includes('7b') || sizeHint.includes('3b') || sizeHint.includes('1b');
    } else if (sizeFilter === 'medium') {
      return sizeHint.includes('13b') || sizeHint.includes('14b') || sizeHint.includes('8b');
    } else if (sizeFilter === 'large') {
      return sizeHint.includes('70b') || sizeHint.includes('34b') || sizeHint.includes('65b');
    }
    
    return true;
  });
}

/**
 * Download a GGUF file from HuggingFace and import into Ollama
 * For text models, automatically creates an Ollama model
 */
export async function downloadModel(
  file: HuggingFaceFile,
  modelId: string,
  modelType?: 'text' | 'image' | 'video' | 'audio' | 'multimodal',
  onProgress?: (progress: number, status: string) => void
): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    // Check if we have the desktop API available
    if (!window.electronAPI?.ollama) {
      // Fallback to browser download
      window.open(file.downloadUrl, '_blank');
      return {
        success: true,
        message: 'Opening download in browser. After download, import the GGUF file into Ollama manually.',
      };
    }

    // For text models, download and auto-import into Ollama
    if (modelType === 'text') {
      onProgress?.(0, 'Starting download...');
      
      // Get model path from settings
      const modelPath = await window.electronAPI.store.get('modelPath') || 
                        await getDefaultModelPath();
      
      // Generate a clean model name for Ollama
      const ollamaModelName = generateOllamaModelName(modelId, file.filename);
      
      // Download the GGUF file
      const downloadResult = await downloadGGUFFile(
        file.downloadUrl,
        modelPath,
        file.filename,
        onProgress
      );
      
      if (!downloadResult.success) {
        return {
          success: false,
          error: downloadResult.error || 'Download failed',
        };
      }
      
      onProgress?.(90, 'Creating Ollama model...');
      
      // Create Modelfile and import into Ollama
      const importResult = await importToOllama(
        downloadResult.filePath!,
        ollamaModelName,
        modelId
      );
      
      if (!importResult.success) {
        return {
          success: false,
          error: importResult.error || 'Failed to import into Ollama',
        };
      }
      
      onProgress?.(100, 'Complete!');
      
      return {
        success: true,
        message: `Successfully imported as "${ollamaModelName}" in Ollama!`,
      };
    } else {
      // For non-text models, just open in browser for now
      window.open(file.downloadUrl, '_blank');
      return {
        success: true,
        message: 'Opening download in browser. Non-text models require manual import.',
      };
    }
  } catch (error) {
    console.error('Error downloading model:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Download a GGUF file to the local filesystem
 */
async function downloadGGUFFile(
  url: string,
  targetDir: string,
  filename: string,
  onProgress?: (progress: number, status: string) => void
): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }
    
    const totalSize = parseInt(response.headers.get('content-length') || '0', 10);
    const reader = response.body?.getReader();
    
    if (!reader) {
      throw new Error('Response body not readable');
    }
    
    // Read the stream and track progress
    const chunks: Uint8Array[] = [];
    let receivedSize = 0;
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      receivedSize += value.length;
      
      const progress = totalSize > 0 ? (receivedSize / totalSize) * 80 : 0; // Reserve 80% for download
      onProgress?.(progress, `Downloading: ${formatFileSize(receivedSize)} / ${formatFileSize(totalSize)}`);
    }
    
    // Combine chunks into a single ArrayBuffer
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }
    
    // Use Electron API to save the file
    const filePath = await window.electronAPI.fileSystem.saveFile(
      targetDir,
      filename,
      combined.buffer
    );
    
    return {
      success: true,
      filePath,
    };
  } catch (error) {
    console.error('Error downloading GGUF file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Download failed',
    };
  }
}

/**
 * Import a GGUF file into Ollama
 */
async function importToOllama(
  ggufPath: string,
  modelName: string,
  originalModelId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Create a Modelfile content
    const modelfile = `FROM ${ggufPath}

# Model imported from HuggingFace: ${originalModelId}
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER top_k 40
`;
    
    // Use Ollama API to create the model
    const response = await fetch('http://localhost:11434/api/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: modelName,
        modelfile: modelfile,
        stream: false,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Ollama create failed: ${response.statusText}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error importing to Ollama:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Import failed',
    };
  }
}

/**
 * Generate a clean Ollama model name from HuggingFace model ID and filename
 */
function generateOllamaModelName(modelId: string, filename: string): string {
  // Extract model name without author
  const [, ...nameParts] = modelId.split('/');
  let modelName = nameParts.join('-').toLowerCase();
  
  // Extract quantization if present
  const quantMatch = filename.match(/[._-]([Qq]\d+[_-][KkMmSs][_-]?[MmSsLl]?)[._-]/);
  const quant = quantMatch ? quantMatch[1].toLowerCase() : 'default';
  
  // Clean up the name
  modelName = modelName.replace(/[-_]gguf$/i, '');
  
  return `${modelName}:${quant}`;
}

/**
 * Get default model path based on OS
 */
async function getDefaultModelPath(): Promise<string> {
  // On Windows: C:\Users\<user>\.ollama\models
  // On macOS: ~/.ollama/models
  // On Linux: ~/.ollama/models
  
  if (window.electronAPI?.fileSystem?.getDefaultModelPath) {
    return await window.electronAPI.fileSystem.getDefaultModelPath();
  }
  
  // Fallback
  return process.platform === 'win32' 
    ? 'C:\\Users\\' + (process.env.USERNAME || 'user') + '\\.ollama\\models'
    : '~/.ollama/models';
}

// Helper functions

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

function extractQuantization(filename: string): string | undefined {
  // Match quantization patterns like Q4_K_M, Q5_K_S, etc.
  const match = filename.match(/[._-]([Qq]\d+[_-][KkMmSs][_-]?[MmSsLl]?)[._-]/);
  return match ? match[1].toUpperCase() : undefined;
}

function detectModelType(tags: string[], pipelineTag?: string): 'text' | 'image' | 'video' | 'audio' | 'multimodal' {
  const allTags = [...tags, pipelineTag || ''].map(t => t.toLowerCase());
  
  if (allTags.some(t => t.includes('image') || t.includes('vision') || t.includes('visual'))) {
    return 'image';
  }
  if (allTags.some(t => t.includes('video'))) {
    return 'video';
  }
  if (allTags.some(t => t.includes('audio') || t.includes('speech'))) {
    return 'audio';
  }
  if (allTags.some(t => t.includes('multimodal'))) {
    return 'multimodal';
  }
  
  return 'text';
}

function getHFPipelineTag(modelType: 'text' | 'image' | 'video'): string {
  switch (modelType) {
    case 'text':
      return 'text-generation';
    case 'image':
      return 'image-to-text';
    case 'video':
      return 'video-classification';
    default:
      return 'text-generation';
  }
}

/**
 * Popular GGUF models as fallback
 */
function getPopularGGUFModels(): HuggingFaceModel[] {
  return [
    {
      id: 'TheBloke/Llama-2-7B-GGUF',
      name: 'Llama-2-7B-GGUF',
      author: 'TheBloke',
      description: 'Llama 2 7B model in GGUF format',
      downloads: 1000000,
      likes: 500,
      tags: ['llama', 'gguf', 'text-generation'],
      lastModified: new Date().toISOString(),
      modelType: 'text',
    },
    {
      id: 'TheBloke/Mistral-7B-Instruct-v0.2-GGUF',
      name: 'Mistral-7B-Instruct-v0.2-GGUF',
      author: 'TheBloke',
      description: 'Mistral 7B Instruct v0.2 in GGUF format',
      downloads: 800000,
      likes: 450,
      tags: ['mistral', 'gguf', 'text-generation', 'instruct'],
      lastModified: new Date().toISOString(),
      modelType: 'text',
    },
    {
      id: 'TheBloke/CodeLlama-7B-GGUF',
      name: 'CodeLlama-7B-GGUF',
      author: 'TheBloke',
      description: 'Code Llama 7B in GGUF format, optimized for code',
      downloads: 600000,
      likes: 400,
      tags: ['code-llama', 'gguf', 'code-generation'],
      lastModified: new Date().toISOString(),
      modelType: 'text',
    },
  ];
}
