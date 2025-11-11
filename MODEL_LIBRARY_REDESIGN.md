# Model Library Redesign - Feature Planning

## 📋 Overview
Redesigning the Model Library page with a 3-tab structure for better model management, discovery, and installation from multiple sources.

---

## 🎯 Goals
1. **Enhanced Installed Models Tab** - Better UI, more details, delete functionality
2. **Ollama Models Tab** - Browse and download from Ollama registry
3. **Hugging Face Models Tab** - Browse and download from HF Hub
4. **Search & Filters** - Size filter, model type filter (text/image/video)
5. **Future-Proof** - Support for image generation and video generation models

---

## 🏗️ Architecture Plan

### Tab Structure
```
Model Library
├── Installed Models (current list + enhancements)
├── Ollama Models (registry browser)
└── Hugging Face Models (HF Hub browser)
```

### Data Flow
```
Ollama Registry API → Service Layer → React State → UI
HuggingFace API → Service Layer → React State → UI
Local Models → Ollama API → Service Layer → UI
```

---

## 📊 Tab Specifications

### 1. Installed Models Tab
**Current State**: Simple list with model name, size, modified date
**Enhancements Needed**:
- ✅ Keep existing list structure
- ⏳ Add model type badge (text/image/video/multimodal)
- ⏳ Add delete button (with confirmation)
- ⏳ Show more details (quantization, family, parameter count)
- ⏳ Better visual card layout
- ⏳ Search/filter within installed models

**UI Components**:
- Model cards with gradient borders
- Delete button (trash icon) with confirmation modal
- Model type badge (color-coded)
- Search bar at top
- Sort options (name, size, date)

### 2. Ollama Models Tab
**Data Source**: https://ollama.com/library (API endpoint TBD)
**Features**:
- ⏳ Search box with live filtering
- ⏳ Size filter slider (< 1GB, 1-5GB, 5-10GB, 10GB+)
- ⏳ Model type filter (text, vision, code, etc.)
- ⏳ Sort by: popularity, size, newest
- ⏳ Download button (pulls model via Ollama API)
- ⏳ Download progress indicator
- ⏳ Model card showing: name, size, description, tags

**API Integration**:
- Research Ollama registry API
- Implement search endpoint
- Handle download via `ollama pull <model>`

### 3. Hugging Face Models Tab
**Data Source**: https://huggingface.co/models API
**Features**:
- ⏳ Search box with HF model search
- ⏳ Size filter (GGUF file size detection)
- ⏳ Model type filter (text-generation, image-to-text, etc.)
- ⏳ Framework filter (GGUF, GGML, PyTorch, etc.)
- ⏳ Download button (GGUF models compatible with Ollama)
- ⏳ Model card showing: name, author, downloads, tags

**API Integration**:
- Use HuggingFace Hub API: https://huggingface.co/api/models
- Filter for GGUF/GGML models (Ollama compatible)
- Implement download via Ollama model file creation

---

## 🔍 Search & Filter System

### Common Filters (All Tabs)
- **Search Box**: Text search in model name/description
- **Size Filter**: Slider with ranges
  - < 1GB (small)
  - 1-5GB (medium)
  - 5-10GB (large)
  - 10GB+ (extra large)
- **Model Type Filter** (Future-proofing):
  - Text Generation (LLM)
  - Image Generation (Stable Diffusion, etc.)
  - Video Generation (future)
  - Vision/Multimodal (future)

### Tab-Specific Filters
**Ollama Tab**:
- Tags (official, community, trending)
- Quantization level (if available)

**Hugging Face Tab**:
- Framework (GGUF, GGML, etc.)
- License (MIT, Apache, etc.)
- Sort by downloads/likes

---

## 🛠️ Technical Implementation

### Files to Create
1. `src/services/ollamaRegistry.ts` - Ollama registry API client
2. `src/services/huggingFace.ts` - HuggingFace API client
3. `src/hooks/useModelBrowser.ts` - Model browsing state management
4. `src/components/ModelCard.tsx` - Reusable model card component
5. `src/components/ModelFilters.tsx` - Filter UI component
6. `src/types/models.types.ts` - Model type definitions

### Files to Modify
1. `src/pages/ModelLibraryPage.tsx` - Add tab structure
2. `src/pages/ModelLibraryPage.css` - Tab styling
3. `src/hooks/useOllama.ts` - Add delete model function
4. `LOG.md` - Document this feature

### API Endpoints Research
- [ ] Ollama registry API documentation
- [ ] HuggingFace models API documentation
- [ ] Model download/pull mechanisms

---

## 🎨 UI/UX Design

### Tab Navigation
```
[Installed Models] [Ollama Models] [Hugging Face Models]
```
- Active tab: pink accent underline
- Smooth tab switching animation
- Persisted tab selection (remember last viewed)

### Model Card Layout
```
┌─────────────────────────────────────┐
│ 🤖 Model Name              [Badge] │
│ Author/Source                       │
│ Description preview...              │
│ ────────────────────────────────── │
│ Size: 4.2GB  •  Type: Text         │
│ [Download] or [Delete]              │
└─────────────────────────────────────┘
```

### Filter Panel (Collapsible Sidebar)
```
[Search: ________________]

Size
[====|====] 0GB - 50GB

Type
☑ Text Generation
☐ Image Generation
☐ Video Generation

[Apply Filters]
```

---

## ✅ Implementation Phases

### Phase 1: Tab Structure & Enhanced Installed Models
- [x] Create planning document (this file)
- [ ] Update ModelLibraryPage with tab structure
- [ ] Enhance installed models UI
- [ ] Add delete model functionality
- [ ] Add model type detection
- [ ] Implement search within installed models

### Phase 2: Ollama Models Tab
- [ ] Research Ollama registry API
- [ ] Create ollamaRegistry service
- [ ] Implement model search
- [ ] Add size filtering
- [ ] Implement download functionality
- [ ] Add download progress UI

### Phase 3: Hugging Face Models Tab
- [ ] Research HuggingFace API
- [ ] Create huggingFace service
- [ ] Implement GGUF model filtering
- [ ] Add size filtering
- [ ] Implement download functionality

### Phase 4: Polish & Testing
- [ ] Add loading states
- [ ] Error handling
- [ ] Toast notifications for downloads
- [ ] Accessibility improvements
- [ ] Performance optimization

---

## 🔬 Research Notes

### Ollama Registry API
**Endpoint**: (To be determined)
- Check ollama.com/library structure
- May need web scraping if no public API
- Alternative: Use Ollama CLI `ollama list --available`

### HuggingFace Hub API
**Endpoint**: `https://huggingface.co/api/models`
**Query Parameters**:
- `search`: Search term
- `filter`: Model type filter
- `sort`: Sort order
- `limit`: Results per page

**Example**:
```
GET https://huggingface.co/api/models?search=llama&filter=gguf&limit=20
```

### Model Type Detection
**Strategies**:
1. Check model tags/metadata
2. Parse model name patterns
3. Use model family detection
4. Future: Query model capabilities via API

---

## 📝 Notes & Decisions

### Model Download Strategy
**Ollama Models**: 
- Use `ollama pull <model>` command
- Stream download progress via IPC

**HuggingFace Models**:
- Download GGUF file
- Create Modelfile
- Import via `ollama create <name> -f Modelfile`

### Size Filter Implementation
- Query model size from API/metadata
- Client-side filtering for performance
- Show human-readable sizes (GB/MB)

### Future Considerations
- Model versioning support
- Multi-file model downloads
- Custom model uploads
- Model sharing/export

---

## 🐛 Potential Issues & Solutions

### Issue 1: No Public Ollama Registry API
**Solution**: Scrape ollama.com/library or use community-maintained API

### Issue 2: HF Model Compatibility
**Solution**: Filter for GGUF/GGML formats only, show compatibility warnings

### Issue 3: Large Download Sizes
**Solution**: Show estimated time, allow cancellation, resume support

### Issue 4: Model Type Detection Accuracy
**Solution**: Manual categorization for popular models, fallback to tags

---

## 🎯 Success Criteria

- [x] Planning document created
- [ ] All 3 tabs functional
- [ ] Search works across all tabs
- [ ] Size filter functional
- [ ] Model download working (Ollama + HF)
- [ ] Delete model working
- [ ] Responsive UI
- [ ] No performance degradation
- [ ] Error handling complete

---

## 📅 Timeline Estimate

- **Phase 1**: 2-3 hours (tab structure + enhanced installed)
- **Phase 2**: 3-4 hours (Ollama integration)
- **Phase 3**: 3-4 hours (HuggingFace integration)
- **Phase 4**: 1-2 hours (polish)
- **Total**: ~10-13 hours of focused development

---

*Document created: November 11, 2025*
*Last updated: November 11, 2025*
