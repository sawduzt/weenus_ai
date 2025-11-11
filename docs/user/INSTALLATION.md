# Installing Weenus AI

## Windows Installation

### Method 1: Using the Installer (Recommended)

1. **Download the installer**
   - Download `Weenus AI Setup 0.1.0.exe` from the releases page

2. **Run the installer**
   - Double-click the `.exe` file
   - Click "Next" through the setup wizard
   - Choose your installation directory (default is fine)
   - Click "Install"

3. **Install Ollama** (Required)
   - If you don't have Ollama installed, the installer will show you a link
   - Visit [ollama.com](https://ollama.com) and download Ollama for Windows
   - Run the Ollama installer and follow the prompts
   - Start Ollama (it will run in the background)

4. **Launch Weenus AI**
   - The installer creates a desktop shortcut and Start menu entry
   - Double-click the Weenus AI icon to launch
   - Wait for it to connect to Ollama (green dot in status bar)

### Method 2: Portable (No Installation)

1. Download `Weenus AI 0.1.0 portable.exe`
2. Double-click to run (no installation needed)
3. Make sure Ollama is installed and running first

### Method 3: From Source

```bash
# Clone the repository
git clone https://github.com/sawduzt/weenus-ai.git
cd weenus-ai

# Install dependencies
npm install

# Development mode
npm run dev

# Build installer
npm run dist:nsis
```

---

## macOS Installation

1. Download `Weenus AI-0.1.0-x64.dmg`
2. Open the DMG file
3. Drag Weenus AI to Applications folder
4. Install Ollama from [ollama.com](https://ollama.com)
5. Launch Weenus AI from Applications

---

## Linux Installation

### Ubuntu/Debian

```bash
# Download the AppImage
wget https://github.com/sawduzt/weenus-ai/releases/download/v0.1.0/Weenus-AI-0.1.0-x64.AppImage

# Make it executable
chmod +x Weenus-AI-0.1.0-x64.AppImage

# Run it
./Weenus-AI-0.1.0-x64.AppImage
```

Or install the .deb package:

```bash
# Download and install
sudo dpkg -i weenus-ai_0.1.0_amd64.deb

# Launch from terminal or applications menu
weenus-ai
```

### Fedora/RHEL

```bash
# Install Ollama first
curl https://ollama.ai/install.sh | sh

# Download AppImage
wget https://github.com/sawduzt/weenus-ai/releases/download/v0.1.0/Weenus-AI-0.1.0-x64.AppImage

# Make executable and run
chmod +x Weenus-AI-0.1.0-x64.AppImage
./Weenus-AI-0.1.0-x64.AppImage
```

---

## System Requirements

### Minimum
- **RAM:** 8GB
- **Storage:** 20GB free (for models)
- **OS:** Windows 10+, macOS 10.13+, or modern Linux

### Recommended
- **RAM:** 16GB+
- **Storage:** 50GB+ free
- **GPU:** NVIDIA with CUDA support (optional, for acceleration)

---

## Installing Ollama

Ollama is required to use Weenus AI. It provides the AI models that the app uses.

### Windows
1. Visit [ollama.com](https://ollama.com)
2. Download "Ollama for Windows"
3. Run the installer
4. Accept the default installation location
5. Ollama will start automatically and run in the background

Check that Ollama is running:
- Look for the Ollama icon in your system tray
- Or open PowerShell and type: `ollama --version`

### macOS
```bash
brew install ollama
ollama serve  # Start Ollama
```

### Linux
```bash
curl https://ollama.ai/install.sh | sh
ollama serve  # Start Ollama
```

---

## Downloading Your First Model

1. **Launch Weenus AI**
2. **Wait for Ollama connection** (green dot in status bar)
3. **Go to Model Library tab**
4. **Click "Ollama Registry"**
5. **Choose a model:**
   - **Mistral** (7B) - Fast, smart, recommended for beginners
   - **Phi-3** (3.8B) - Lightweight, great for older computers
   - **Llama 3.2** (1B) - Tiny, very fast responses

6. **Click Download** and wait for it to complete
7. **Return to Chat** and select your model from the dropdown
8. **Start chatting!**

---

## Troubleshooting Installation

### "Ollama not found"
- Make sure Ollama is installed from [ollama.com](https://ollama.com)
- Start Ollama in the system tray
- Restart Weenus AI

### "Models won't download"
- Check your internet connection
- Ensure you have at least 20GB free disk space
- Try downloading a smaller model first (Phi-3 at 3.8GB)
- Check that Ollama is running (status bar should show 🟢 Connected)

### "App won't start"
- Make sure your computer meets minimum requirements (8GB RAM)
- Restart your computer
- Reinstall Ollama
- Download and reinstall Weenus AI

### Windows: "No internet after install"
- This is usually temporary while Ollama starts
- Wait 30 seconds and refresh
- Check that Ollama service is running in Task Manager

---

## Getting Help

- **Official Docs:** [Weenus AI GitHub](https://github.com/sawduzt/weenus-ai)
- **Ollama Help:** [ollama.com](https://ollama.com)
- **Issue Reports:** [GitHub Issues](https://github.com/sawduzt/weenus-ai/issues)

---

## What's Next?

After installing:
1. Download a model from Model Library
2. Go through the Getting Started tour (Settings > Replay Getting Started Tour)
3. Experiment with different models and parameters
4. Enjoy chatting with local AI! 🐰✨
