# Model Library Documentation

## Overview

The Model Library provides a 3-tab interface for browsing, downloading, and managing AI models from multiple sources.

## Features

### Tab Navigation System
- **Installed Models**: View locally installed Ollama models with metadata
- **Ollama Registry**: Browse curated popular Ollama models
- **HuggingFace Models**: Search and download GGUF models from HuggingFace Hub
- Tab switching with state preservation
- Active tab highlighting with pink underline
- Model count badge on Installed Models tab

### Search & Filter System
- Universal search box that works across all tabs
- **Size filter** with categories:
  - Small: <5GB
  - Medium: 5-15GB
  - Large: >15GB
- Real-time filtering with instant results
- Filter state preserved when switching tabs

### Installed Models Tab
**UI Features:**
- Card-based layout with hover effects
- Model name in pink accent color
- Badge system showing:
  - File size
  - Model family (e.g., "llama")
  - Quantization level (e.g., "Q4_0")
- Metadata display:
  - Format (GGUF, GGML, etc.)
  - Parameter count
  - Last modified date
- Delete button (with confirmation)

**Technical Details:**
- Grid layout: `repeat(auto-fill, minmax(380px, 1fr))`
- Smooth hover animations
- Empty states for no results

### Ollama Registry Tab
**Features:**
- 16+ curated popular models including:
  - Llama 3.2 (1B-90B variants)
  - Mistral (7B)
  - Mixtral (8x7B, 8x22B)
  - Phi-3 (3.8B-14B)
  - Gemma 2 (2B-27B)
  - Qwen 2.5 (0.5B-72B)
  - CodeLlama (7B-70B)
  - DeepSeek Coder V2
  - Command R/R+
  - LLaVA (vision models)
  - Granite 3 (dense & MoE)

**Model Cards Display:**
- Model name and description
- Size range (e.g., "4.7GB - 40GB")
- Available variant tags (8B, 70B, etc.)
- Capability badges:
  - 🟢 Vision (green)
  - 🟡 Tools (yellow)
- Download button (pink):
  - Shows "Installed" with checkmark if already downloaded
  - Shows progress percentage while downloading
  - Disabled when installed
- Download progress bar with status text

**Download System:**
- Streaming download via Ollama API (`/api/pull`)
- Real-time progress tracking
- Status updates (pulling manifest, downloading, verifying)
- Error handling with toast notifications
- Auto-refresh installed models on completion

### HuggingFace Models Tab
**Features:**
- Search HuggingFace Hub API for GGUF models
- Fallback to popular models (TheBloke's repos)
- Expandable model cards (click to see files)

**Model Cards Display:**
- Model name and author
- Description
- Badges:
  - Model type (text/image/video/multimodal)
  - Download count
  - Like count
- Click to expand and see GGUF file variants

**File Selection:**
- Lists all available GGUF files
- Shows file size and quantization level
- Individual download buttons per file
- Import instructions with code example
- Opens download in browser (direct download)

**Model Type Detection:**
- 🔵 Text generation (blue)
- 🟢 Image/Vision (green)
- 🟣 Video (purple)
- 🟡 Multimodal (yellow)

## Service Layer

**ollamaRegistry.ts:**
- `getPopularModels()` - Returns curated model list
- `searchModels(query)` - Filter by search term
- `filterBySize(models, sizeFilter)` - Apply size filter
- `downloadModel(name, onProgress)` - Stream download from Ollama
- Capability detection (chat, vision, tools)

**huggingFace.ts:**
- `searchModels(query, options)` - Search HF Hub API
- `getModelFiles(modelId)` - Get GGUF files for model
- `filterBySize(models, sizeFilter)` - Apply size filter
- `downloadModel(file)` - Open browser download
- Model type detection from tags
- Quantization extraction from filenames
- File size formatting

## Implementation Details

### Files
1. `src/services/ollamaRegistry.ts` - Ollama model registry service
2. `src/services/huggingFace.ts` - HuggingFace integration service
3. `src/pages/ModelLibraryPage.tsx` - Main UI component
4. `src/pages/ModelLibraryPage.css` - Styling

## User Experience

### Visual Design
- Consistent pink accent color (#FF6B9D)
- Smooth transitions (0.2s ease)
- Hover effects on all interactive elements
- Card-based layouts with shadows
- Badge system with color coding
- Proper spacing and hierarchy

### Interactions
- Click tabs to switch views
- Type to search instantly
- Select size filter from dropdown
- Click Ollama model cards to download
- Click HF model cards to expand/collapse
- Click individual files to download
- Refresh button for installed models

### Feedback
- Loading states
- Empty states with helpful messages
- Progress bars for downloads
- Toast notifications for success/error
- "Installed" badges prevent re-downloads
- Disabled states for unavailable actions

## Technical Notes

### Size Filtering Logic
```typescript
// Categorizes models by size
function getModelSizeCategory(bytes: number): 'small' | 'medium' | 'large' {
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb < 5) return 'small';
  if (gb < 15) return 'medium';
  return 'large';
}
```

### Download Progress Tracking
```typescript
// Streaming JSON-ND from Ollama API
const reader = result.body?.getReader();
while (!done) {
  const { value, done: readerDone } = await reader.read();
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n').filter(line => line.trim());
  for (const line of lines) {
    const data = JSON.parse(line);
    onProgress?.({
      status: data.status,
      completed: data.completed,
      total: data.total,
    });
  }
}
```

### Component Architecture
```
ModelLibraryPage
├── Tab Navigation
├── Search & Filter Bar
└── Tab Content
    ├── InstalledModelsTab
    ├── OllamaRegistryTab
    └── HuggingFaceTab
```

---

*This documentation is maintained as the Model Library evolves.*
