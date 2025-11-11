# 🚀 Getting Started with Weenus AI

Welcome to **Weenus AI** — a beautiful, modern desktop application for chatting with local AI models, powered by Ollama!

## 📋 What is Weenus AI?

Weenus AI gives you:
- 💬 **AI Chat**: Real-time conversations with AI models running locally on your computer
- 🤖 **Model Library**: Browse, download, and manage AI models
- ⚙️ **Smart Settings**: Fine-tune how the AI responds with intuitive parameter controls
- 🎨 **Beautiful Design**: A cute, modern interface with a friendly pink bunny theme

**All conversations stay on your computer** — no data sent to external servers!

---

## ⚡ Quick Start (5 minutes)

### Step 1: Install Prerequisites
1. **Download Ollama** from [ollama.com](https://ollama.com) and install it
2. **Start Ollama** (it runs in the background)

### Step 2: Launch Weenus AI
1. Double-click the Weenus AI icon
2. Wait for it to connect to Ollama (you'll see a green dot when ready)
3. Start chatting!

### Step 3: Download Your First Model
1. Go to **Model Library** tab
2. Click **Ollama Registry**
3. Click any model's **Download** button
4. Wait for the download to complete
5. Return to **Chat** and select your model from the dropdown

**That's it!** You're ready to chat with local AI. 🎉

---

## � How to Use Each Feature

### 💬 Chat Page

**The main chat interface where you talk to AI:**

```
┌─────────────────────────────────────────────┐
│ 📋 Chat Title                    [Model ▼] │
├─────────────────────────────────────────────┤
│                                             │
│  You: Hey, how are you?                     │
│                                             │
│  AI: I'm doing well, thank you for asking! │
│      How can I help you today?              │
│                                             │
├─────────────────────────────────────────────┤
│ [Message input field...] [Send button]      │
└─────────────────────────────────────────────┘
```

**What you can do:**
- Type a message and press **Enter** or click **Send**
- **Switch Models**: Click the model dropdown to change AI model mid-chat
- **View History**: Scroll up to see previous messages in this chat
- **New Chat**: Click the **+** in the sidebar to start a fresh conversation
- **Delete Chat**: Hover over a chat in the sidebar and click the trash icon

---

### 🤖 Model Library

**Download and manage AI models:**

**Installed Models Tab:**
- Shows models you've already downloaded
- Click **Refresh** to update the list
- Click the trash icon to delete a model (frees up disk space)

**Ollama Registry Tab:**
- Browse popular AI models from Ollama
- Click **Download** to install a model
- View download progress in the **Downloads** panel (top right)

**HuggingFace Models Tab:**
- Access more models from the HuggingFace community
- Click a model to see available versions
- Larger files = potentially better quality

**💡 Tip:** Start with smaller models (7B parameters) for faster responses. Try `mistral` or `phi3` for quick, efficient AI!

---

### ⚙️ Settings

**Customize your AI experience:**

#### Model Parameters
Configure how each AI model responds:

- **Temperature** (0.0 - 2.0)
  - **0.1**: Focused, consistent answers (math, facts)
  - **0.7**: Balanced (default)
  - **1.8**: Creative, varied answers (writing, brainstorming)

- **Top P** (0.0 - 1.0)
  - Controls diversity of word choices
  - Lower = more predictable, Higher = more creative

- **Max Tokens** (1 - 8192)
  - Maximum length of AI's response
  - 1 token ≈ 4 characters

- **Repeat Penalty** (0.5 - 2.0)
  - Prevents AI from repeating itself
  - Higher values = less repetition

**How to customize:**
1. Go to **Settings**
2. Select a model from the dropdown
3. Adjust the sliders
4. Click **Save Changes**
5. Parameters apply to all future chats with that model

**Test Your Settings:**
- Set Temperature to 0.1, ask "What is 2+2?" → Same answer every time ✓
- Set Temperature to 1.8, ask same question → Different creative answers ✓
- Increase Max Tokens, ask a detailed question → Longer responses ✓

---

## 📊 Status Bar (Bottom of Window)

The bottom bar shows important info:

```
🟢 Connected | Memory: 2.14 GB | GPU: Active | Tokens/s: 160.83 | Weenus AI v0.1.0 | Release Build
```

- **🟢 Connected**: Ollama is running and ready
- **Memory**: How much RAM your AI model is using
- **GPU**: Whether GPU acceleration is active
- **Tokens/s**: How fast the AI is responding (higher = faster)

---

## ❓ Frequently Asked Questions

### "How do I set a custom Ollama models folder?"
1. Go to **Settings**
2. Look for **Model Path** (coming soon)
3. Set the path to your folder
4. Ollama will use that location for downloads

### "Can I use my GPU?"
Yes! If you have an NVIDIA GPU with CUDA support:
1. Install Ollama with GPU support
2. GPU acceleration is automatic if available
3. Check the **GPU: Active** indicator in the status bar

### "What if I don't have an Ollama model?"
Download one from **Model Library → Ollama Registry**. We recommend starting with:
- **Mistral** (7B) - Fast and smart
- **Phi-3** (3.8B) - Super efficient
- **Llama 3.2** (1B) - Lightweight

### "How much storage do I need?"
Models range from **1GB to 100GB+**. Check the model size before downloading:
- Small models (1-5GB): Mistral, Phi-3, Llama 1B
- Medium models (5-15GB): Llama 3 (8B), Gemma 2
- Large models (15GB+): Llama 3 (70B), Mixtral

### "Can I use Weenus AI offline?"
Yes, after models are downloaded! Ollama and Weenus AI run entirely locally. No internet needed once running.

---

## 🆘 Troubleshooting

### Ollama Won't Connect
**Problem:** Red dot, "Ollama Disconnected"

**Solutions:**
1. Make sure Ollama is installed from [ollama.com](https://ollama.com)
2. Start Ollama in your system tray or terminal
3. Click **Refresh** in Model Library to reconnect
4. Restart both Ollama and Weenus AI

### Models Won't Download
**Problem:** Download fails or gets stuck

**Solutions:**
1. Check internet connection
2. Ensure you have enough disk space
3. Check Ollama is running (status bar should show 🟢 Connected)
4. Try downloading a smaller model first

### AI Responses Are Slow
**Problem:** Taking forever to respond

**Solutions:**
1. Check **Memory** in status bar — if system is out of RAM, responses slow down
2. Try a smaller model (fewer parameters)
3. Close other apps to free up memory
4. Check CPU usage — high CPU means it's working hard

### Parameters Don't Seem to Work
**Problem:** Temperature and other settings aren't changing output

**Solutions:**
1. Make sure you clicked **Save Changes** (button should turn green)
2. Start a **New Chat** so it uses the new settings
3. Use extreme values to test (Temperature 0.1 vs 1.8 should be obvious difference)

---

## 💡 Pro Tips

### For Better Responses
- **Use clear prompts**: "Explain quantum computing to a 10-year-old" works better than "explain quantum"
- **Give context**: Tell the AI what you want it to do
- **Low temperature** for facts (math, code, definitions)
- **High temperature** for creative tasks (writing, brainstorming)

### Performance Tips
- Keep system RAM free — close unused apps
- Use smaller models for faster responses (Mistral, Phi-3)
- Enable GPU if available (see status bar)
- Monitor **Tokens/s** — this shows real-time AI speed

### Organization Tips
- Create separate chats for different topics
- Use chat titles to remember context
- Save your favorite parameter settings in Settings
- Export important conversations (feature coming soon!)

---

## 🚀 What's Next?

You're all set! Here are some fun things to try:

1. **Chat with multiple models** — ask the same question to different AI models
2. **Experiment with temperature** — see how it changes responses
3. **Download more models** — compare different AI capabilities
4. **Customize parameters** — find your sweet spot for each task

---

## 📬 Need Help?

- **Ollama Official Docs**: [ollama.com](https://ollama.com)
- **Model Information**: Check the model descriptions in Model Library
- **Issue Tracker**: Report bugs or request features on GitHub

**Have fun with Weenus AI!** 🐰✨