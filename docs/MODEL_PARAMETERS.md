# Model Parameter Configuration

The model parameter configurator allows users to configure AI generation parameters on a per-model basis. Each model can have custom parameter presets that are persistently saved and automatically loaded.

## Features

### Model Selection
- Dropdown selector showing all installed Ollama models
- Dynamically loads parameters for the selected model
- Disabled when no models are available

### Parameter Controls
Five essential parameters with sliders and live value display:

1. **Temperature** (0.0 - 2.0, step 0.1)
   - Controls randomness and creativity of responses
   - 0.0 = Deterministic, 2.0 = Very creative
   - Hint: "Controls randomness (0=deterministic, 2=creative)"

2. **Top P** (0.0 - 1.0, step 0.05)
   - Nucleus sampling parameter
   - Lower = focused, Higher = diverse
   - Hint: "Nucleus sampling (lower=focused, higher=diverse)"

3. **Top K** (1 - 100, step 1)
   - Limits token selection to top K choices
   - Lower = constrained, Higher = more freedom
   - Hint: "Limits to top K tokens (lower=focused)"

4. **Repeat Penalty** (0.5 - 2.0, step 0.1)
   - Penalizes repeated tokens
   - 1.0 = No penalty
   - Hint: "Penalizes repetition (1.0=no penalty)"

5. **Max Tokens** (100 - 8192, step 100)
   - Maximum number of tokens to generate
   - Controls response length
   - Hint: "Maximum response length in tokens"

### Save & Reset Functionality

**Save Button**:
- Saves all parameter values for the currently selected model
- Shows confirmation toast
- Disabled when no model is selected

**Reset Button**:
- Shows confirmation dialog before resetting
- Resets parameters to Ollama defaults
- Disabled when no model is selected

## Design

The configurator uses the pink bunny theme with:
- Color scheme: Pink accents (#FF6B9D)
- Layout: Responsive grid of parameter cards
- Typography: Clean text with descriptive hints
- Card design: Borders with hover shadow effects
- Slider styling: Large, pink thumbs with smooth animations
- Value display: Monospace font with background

## Component Structure

### Files

```
src/
├── types/parameters.types.ts              # Type definitions
├── services/modelParameters.ts            # Persistence layer
├── hooks/useModelParameters.ts            # State management hook
├── components/
│   ├── ModelParametersConfigurator.tsx   # UI component
│   └── ModelParametersConfigurator.css   # Styling
└── pages/
    ├── SettingsPage.tsx                  # Settings page integration
    └── SettingsPage.css                  # Settings styling
```

### Component Hierarchy

```
SettingsPage (Settings Tab)
  └─ ModelParametersConfigurator
      ├─ useOllama() hook (for model selection)
      ├─ useModelParameters() hook (for parameter state)
      ├─ useToast() hook (for notifications)
      ├─ Model Selector Section
      ├─ Action Buttons (Save, Reset)
      ├─ Reset Confirmation Dialog
      └─ Parameter Cards Grid
          └─ Parameter Card (x5)
              ├─ Label + Value Display
              ├─ Slider Input
              └─ Hint Text
```
      ├─ useToast() hook (for notifications)
      ├─ Model Selector Section
      ├─ Action Buttons (Save, Reset)
      ├─ Reset Confirmation Dialog
      └─ Parameter Cards Grid
          └─ Parameter Card (x5)
              ├─ Label + Value Display
              ├─ Slider Input
              └─ Hint Text
```

## User Flow

1. **Navigate to Settings** → Click "Parameters" tab
2. **Select Model** → Choose from dropdown of installed models
3. **Adjust Parameters** → Use sliders to customize generation behavior
4. **Save** → Click "Save" button to persist changes
5. **Confirmation** → Toast notification confirms save
6. **Next Time** → Parameters automatically load when model is selected again

### Reset Flow

1. Click "Reset" button
2. Confirmation dialog appears with warning
3. Confirm to reset
4. Parameters reset to Ollama defaults
5. Toast confirms: "Reset to Defaults"

## Technical Details

### Type Definitions (parameters.types.ts)

```typescript
interface ModelParameters {
  temperature: number;
  topP: number;
  topK: number;
  repeatPenalty: number;
  maxTokens: number;
}

interface SavedModelPreset {
  modelName: string;
  parameters: ModelParameters;
  savedAt: Date;
}

const DEFAULT_PARAMETERS = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  repeatPenalty: 1.1,
  maxTokens: 2048,
};

const PARAMETER_RANGES = {
  [key]: { min, max, step, label, hint }
}
```

### Service Layer (modelParameters.ts)

**Methods**:
- `getModelParameters(modelName)` - Fetch parameters for a model
- `saveModelParameters(modelName, parameters)` - Persist parameters
- `resetModelParameters(modelName)` - Delete saved parameters (revert to defaults)
- `getAllPresets()` - Get all saved model presets
- `deleteModelParameters(modelName)` - Remove parameters for a model

**Storage Location**:
- Windows: `%APPDATA%/weenus-ai/config.json` (under `modelParameters` key)
- macOS: `~/Library/Application Support/weenus-ai/config.json`
- Linux: `~/.config/weenus-ai/config.json`

### Hook (useModelParameters.ts)

**State**:
- `parameters` - Current parameter values
- `isLoading` - Loading state when fetching
- `isSaving` - Saving state when persisting

**Functions**:
- `updateParameter(key, value)` - Update a single parameter in state
- `saveParameters()` - Save all parameters for current model
- `resetToDefaults()` - Reset to defaults and delete saved preset

### Component (ModelParametersConfigurator.tsx)

**Features**:
- Reactive model selection via dropdown
- Real-time parameter adjustment
- Save/Reset button management
- Confirmation dialog for resets
- Toast notifications for user feedback
- Empty state when no model selected
- Responsive design

## Styling Details

### Colors Used
- **Primary accent**: `--accent-primary` (#FF6B9D)
- **Secondary background**: `--bg-secondary`
- **Tertiary background**: `--bg-tertiary`
- **Text colors**: Primary, secondary, muted
- **Borders**: Primary and secondary variants
- **Error color**: For reset button confirmation

### Layout
- **Header section**: Flexbox, space-between layout
- **Parameter grid**: CSS Grid with auto-fit columns
- **Card design**: Flex column with gap-based spacing
- **Responsive**: Single column on mobile, multi-column on desktop

### Animations
- Smooth transitions on all interactive elements
- Slider thumb scales on hover
- Card hover shadow effect
- Dialog slide-up animation
- Overlay fade-in

## Integration Points

### With useOllama Hook
- Gets list of installed models
- Maintains current model selection state
- Used to disable controls when no models available

### With useToast Hook
- Success toast when parameters saved
- Error toast when save fails
- Success toast when reset to defaults
- Error toast if reset fails

### With Electron Store
- Persists model parameters to `electron-store`
- Survives app restart
- Per-user, per-machine configuration

## Technical Details

### Type Definitions (parameters.types.ts)

```typescript
interface ModelParameters {
  temperature: number;
  topP: number;
  topK: number;
  repeatPenalty: number;
  maxTokens: number;
}

interface SavedModelPreset {
  modelName: string;
  parameters: ModelParameters;
  savedAt: Date;
}

const DEFAULT_PARAMETERS = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  repeatPenalty: 1.1,
  maxTokens: 2048,
};

const PARAMETER_RANGES = {
  [key]: { min, max, step, label, hint }
}
```

### Service Layer (modelParameters.ts)

**Methods**:
- `getModelParameters(modelName)` - Fetch parameters for a model
- `saveModelParameters(modelName, parameters)` - Persist parameters
- `resetModelParameters(modelName)` - Delete saved parameters
- `getAllPresets()` - Get all saved model presets

**Storage Location**:
- Windows: `%APPDATA%/weenus-ai/config.json`
- macOS: `~/Library/Application Support/weenus-ai/config.json`
- Linux: `~/.config/weenus-ai/config.json`

---

*See `PARAMETER_RANGES` in `parameters.types.ts` for detailed parameter descriptions.*
