/**
 * Ollama Registry Service
 * 
 * Fetches and parses model information from the Ollama model registry.
 * Note: Ollama doesn't have a public REST API for the registry, so we'll
 * need to scrape the library page or use the ollama CLI to list available models.
 */

export interface OllamaRegistryModel {
  name: string;
  description: string;
  tags: string[];
  // Estimated size - we'll try to get this from the model details
  size?: number;
  sizeDisplay?: string;
  // Model type
  modelType?: 'text' | 'image' | 'video' | 'multimodal';
  // Model capabilities
  capabilities?: {
    chat: boolean;
    vision?: boolean;
    tools?: boolean;
  };
  // Popularity metrics if available
  pulls?: number;
  updated?: string;
}

/**
 * Popular Ollama models with metadata
 * This is a curated list since Ollama doesn't have a public API
 */
const POPULAR_MODELS: OllamaRegistryModel[] = [
  {
    name: 'llama3.2',
    description: 'Meta\'s Llama 3.2 model with improved reasoning and coding capabilities',
    tags: ['3B', '1B'],
    sizeDisplay: '2GB - 2.3GB',
    modelType: 'text',
    capabilities: { chat: true, vision: false, tools: true },
  },
  {
    name: 'llama3.2-vision',
    description: 'Llama 3.2 with vision capabilities for image understanding',
    tags: ['11B', '90B'],
    sizeDisplay: '7.9GB - 55GB',
    modelType: 'multimodal',
    capabilities: { chat: true, vision: true, tools: true },
  },
  {
    name: 'llama3.1',
    description: 'Meta\'s Llama 3.1 model with extended context window (128K tokens)',
    tags: ['8B', '70B', '405B'],
    sizeDisplay: '4.7GB - 231GB',
    modelType: 'text',
    capabilities: { chat: true, tools: true },
  },
  {
    name: 'llama3',
    description: 'Meta\'s Llama 3 model, excellent for general tasks',
    tags: ['8B', '70B'],
    sizeDisplay: '4.7GB - 40GB',
    modelType: 'text',
    capabilities: { chat: true },
  },
  {
    name: 'mistral',
    description: 'Mistral 7B model, fast and efficient',
    tags: ['7B'],
    sizeDisplay: '4.1GB',
    modelType: 'text',
    capabilities: { chat: true },
  },
  {
    name: 'mixtral',
    description: 'Mixtral 8x7B mixture of experts model',
    tags: ['8x7B', '8x22B'],
    sizeDisplay: '26GB - 80GB',
    modelType: 'text',
    capabilities: { chat: true, tools: true },
  },
  {
    name: 'phi3',
    description: 'Microsoft\'s Phi-3 small language model, very efficient',
    tags: ['3.8B', '14B'],
    sizeDisplay: '2.3GB - 7.9GB',
    modelType: 'text',
    capabilities: { chat: true },
  },
  {
    name: 'gemma2',
    description: 'Google\'s Gemma 2 model with strong performance',
    tags: ['2B', '9B', '27B'],
    sizeDisplay: '1.6GB - 16GB',
    modelType: 'text',
    capabilities: { chat: true },
  },
  {
    name: 'qwen2.5',
    description: 'Qwen 2.5 model with multilingual capabilities',
    tags: ['0.5B', '1.5B', '3B', '7B', '14B', '32B', '72B'],
    sizeDisplay: '0.4GB - 43GB',
    modelType: 'text',
    capabilities: { chat: true, tools: true },
  },
  {
    name: 'deepseek-coder-v2',
    description: 'DeepSeek Coder V2, specialized for programming',
    tags: ['16B', '236B'],
    sizeDisplay: '8.9GB - 133GB',
    modelType: 'text',
    capabilities: { chat: true, tools: true },
  },
  {
    name: 'codellama',
    description: 'Meta\'s Code Llama, optimized for code generation',
    tags: ['7B', '13B', '34B', '70B'],
    sizeDisplay: '3.8GB - 39GB',
    modelType: 'text',
    capabilities: { chat: true },
  },
  {
    name: 'command-r',
    description: 'Cohere\'s Command R model for RAG and tool use',
    tags: ['35B'],
    sizeDisplay: '20GB',
    modelType: 'text',
    capabilities: { chat: true, tools: true },
  },
  {
    name: 'command-r-plus',
    description: 'Cohere\'s larger Command R+ model',
    tags: ['104B'],
    sizeDisplay: '59GB',
    modelType: 'text',
    capabilities: { chat: true, tools: true },
  },
  {
    name: 'llava',
    description: 'Large Language and Vision Assistant',
    tags: ['7B', '13B', '34B'],
    sizeDisplay: '4.7GB - 20GB',
    modelType: 'multimodal',
    capabilities: { chat: true, vision: true },
  },
  {
    name: 'granite3-dense',
    description: 'IBM\'s Granite 3 dense model for enterprise use',
    tags: ['2B', '8B'],
    sizeDisplay: '1.6GB - 4.9GB',
    modelType: 'text',
    capabilities: { chat: true },
  },
  {
    name: 'granite3-moe',
    description: 'IBM\'s Granite 3 mixture of experts model',
    tags: ['1B', '3B'],
    sizeDisplay: '1.3GB - 2.4GB',
    modelType: 'text',
    capabilities: { chat: true },
  },
];

/**
 * Get the list of popular Ollama models
 */
export async function getPopularModels(): Promise<OllamaRegistryModel[]> {
  // In the future, this could fetch from an actual API or scrape ollama.com/library
  return Promise.resolve(POPULAR_MODELS);
}

/**
 * Search models by name or description
 */
export async function searchModels(query: string): Promise<OllamaRegistryModel[]> {
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) {
    return getPopularModels();
  }

  const models = await getPopularModels();
  return models.filter(model => 
    model.name.toLowerCase().includes(lowerQuery) ||
    model.description.toLowerCase().includes(lowerQuery) ||
    model.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Estimate model size category based on size display
 */
export function estimateSizeCategory(sizeDisplay: string): 'small' | 'medium' | 'large' {
  const match = sizeDisplay.match(/(\d+(?:\.\d+)?)\s*GB/i);
  if (!match) return 'medium';
  
  const gb = parseFloat(match[1]);
  if (gb < 5) return 'small';
  if (gb < 15) return 'medium';
  return 'large';
}

/**
 * Filter models by size
 */
export async function filterBySize(
  models: OllamaRegistryModel[],
  sizeFilter: 'all' | 'small' | 'medium' | 'large'
): Promise<OllamaRegistryModel[]> {
  if (sizeFilter === 'all') {
    return models;
  }

  return models.filter(model => {
    if (!model.sizeDisplay) return false;
    
    // Parse the size range (e.g., "2GB - 2.3GB" or "4.1GB")
    const sizes = model.sizeDisplay.match(/(\d+(?:\.\d+)?)\s*GB/gi);
    if (!sizes || sizes.length === 0) return false;
    
    // Check if any size in the range matches the filter
    return sizes.some(size => {
      const gb = parseFloat(size);
      const category = gb < 5 ? 'small' : gb < 15 ? 'medium' : 'large';
      return category === sizeFilter;
    });
  });
}

/**
 * Download a model from Ollama registry using ollama pull
 */
export async function downloadModel(
  modelName: string,
  onProgress?: (progress: { status: string; completed?: number; total?: number }) => void,
  modelPath?: string
): Promise<{ success: boolean; error?: string }> {
  if (!window.electronAPI?.ollama) {
    return {
      success: false,
      error: 'Desktop app required for model downloads',
    };
  }

  try {
    onProgress?.({ status: 'Preparing download...' });

    // Get the model path to use
    let pathToUse = modelPath;
    if (!pathToUse) {
      // Get from settings or use default
      const savedPath = await window.electronAPI.store.get('modelPath');
      if (savedPath) {
        pathToUse = savedPath;
      } else {
        // Get default path from Electron
        pathToUse = await window.electronAPI.fileSystem.getDefaultModelPath();
      }
    }

    // If a custom model path is provided, restart Ollama with that path
    if (pathToUse) {
      onProgress?.({ status: 'Configuring model storage...' });
      const restartResult = await window.electronAPI.ollama.restart(pathToUse);
      if (!restartResult.success) {
        console.warn('Failed to restart Ollama with custom path:', restartResult.error);
        // Continue anyway - Ollama might still work with default path
      }
    }

    onProgress?.({ status: 'Downloading model...' });
    
    const result = await fetch('http://localhost:11434/api/pull', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelName, stream: true }),
    });

    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`);
    }

    const reader = result.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;

      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            
            if (data.status) {
              onProgress?.({
                status: data.status,
                completed: data.completed,
                total: data.total,
              });
            }

            if (data.error) {
              throw new Error(data.error);
            }
          } catch (e) {
            // Skip malformed JSON
            if (e instanceof SyntaxError) continue;
            throw e;
          }
        }
      }
    }

    onProgress?.({ status: 'Download complete!' });
    return { success: true };
  } catch (error) {
    console.error('Error downloading model:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
