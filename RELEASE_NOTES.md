# Weenus AI v0.1.0 - Release Build

🎉 **Release Ready for Distribution**

## What's Included

✅ Complete Weenus AI application  
✅ Interactive onboarding guide for first-time users  
✅ Real-time performance metrics (tokens/s, memory, GPU)  
✅ Full chat history and model management  
✅ Comprehensive settings and parameter customization  
✅ Professional Windows NSIS installer  

## Distribution

### Installer Location
```
dist/Weenus AI Setup 0.1.0.exe (81.5 MB)
```

### Installer Features
- **Custom Installation Path**: Users can choose where to install
- **Desktop Shortcut**: Automatically creates desktop icon
- **Start Menu Entry**: Adds to Windows Start Menu
- **Uninstaller**: Easy removal via Control Panel
- **No Bloatware**: Clean, minimal footprint

### System Requirements
- **OS**: Windows 10 or later
- **RAM**: 8GB minimum, 16GB+ recommended
- **Storage**: 20GB free (for models)
- **Internet**: Required for Ollama and model downloads

## First-Time User Experience

1. **Install via Installer**
   - Run `Weenus AI Setup 0.1.0.exe`
   - Choose installation location
   - Click Install - done in ~30 seconds

2. **First Launch**
   - Automatic onboarding appears
   - 8 interactive steps covering all features
   - Users can skip or replay anytime (Settings > General)

3. **Setup Ollama**
   - Installer shows link to ollama.com
   - User installs Ollama independently
   - Weenus AI detects when ready

4. **Download Models**
   - Model Library shows available models
   - Mistral (7B) and Phi-3 (3.8B) recommended
   - Start chatting within minutes

## What's NOT Included

- ❌ Ollama (user downloads separately from ollama.com)
- ❌ AI Models (downloaded on-demand from Ollama/HuggingFace)
- ❌ User data/settings (starts fresh per user)
- ❌ Development files (clean production build)

## Installer Testing Checklist

- [ ] Installer runs without errors
- [ ] Custom installation path works
- [ ] Desktop shortcut created
- [ ] Start Menu entry created  
- [ ] App launches from shortcuts
- [ ] Uninstaller removes app cleanly
- [ ] First launch shows onboarding
- [ ] Settings > General > "Replay Getting Started Tour" works

## Release Notes

### v0.1.0 - Initial Release
**New Features**
- 🐰 Beautiful dark-themed desktop app with pink accents
- 💬 Real-time streaming chat with local AI models
- 🤖 Model Library with Ollama/HuggingFace integration
- ⚙️ Per-model parameter customization
- 📊 Live performance metrics (tokens/s, memory, GPU)
- 🎓 Interactive onboarding guide
- 💾 Persistent chat history
- 🔄 Model switching mid-conversation

**Technical Details**
- Built with Electron 27 + React 18 + TypeScript
- Vite for lightning-fast builds
- Tailwind CSS for styling
- electron-store for local data persistence
- Full support for Windows/macOS/Linux

## Support & Resources

- **Getting Started**: See `docs/user/GETTING_STARTED.md`
- **Installation Guide**: See `docs/user/INSTALLATION.md`
- **Ollama Docs**: https://ollama.com
- **GitHub Issues**: Report bugs or request features

## Build Information

- **Built**: November 11, 2025
- **Version**: 0.1.0
- **Installer Size**: 81.5 MB
- **App Version**: Shown in status bar as "Release Build v0.1.0"

## Next Steps for Distribution

1. Upload `dist/Weenus AI Setup 0.1.0.exe` to release pages
2. Create release notes with download links
3. Share installer with users
4. Collect feedback for v0.2.0

---

**Happy releasing! 🚀**
