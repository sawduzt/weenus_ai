```markdown
# MSTY-Style Desktop AI App: Comprehensive Development Plan

The app will be named Weenus, a comprehensive frontend for simple use of local ai, for chat and media generation.
The app should have a sleek, modern GUI featuring windows mica and various selectable themes, with a comprehensive featureset
The app should use Ollama for its main AI backend
the user should be able to easily tweak model paramaters (per model)
The user should be able to select their desired ai model to run from downloaded models (selectable model folder path in settings tab)
the Focus on the app should be a fully fledged and intuitive featureset, while everything remaining easy to use and simple

MUST HAVE FEATURES: - Clean GUI - Model picker - Chat selector - Persistent memory - Paramater tweaking - File upload - AI statistics (gpu use, vram use, tokens per second, seconds to first token) - consider implementing some features as widgets that can be toggled - Model downloader (from ollama or hugging face) - Streaming where capable - Embedding where capable - IMGGEN CATEGORY (with model picker, downloader, parms, and so on) - VIDGEN CATEGORY (with model picker, downloader, parms and so on) - Comprehensive settings tab - Maybe hosting a webpage on the local network for access from other devices? - anything else you think is cool

APP STRUCTURE (subject to change)
main chat window with user and ai messages
message input box at bottom, with various buttons (parm tweaker, model selector drop down, tool selector, file upload box so on)
Left toggelable side bar, with the top having a list of previous chats to switch to, and the bottom having a few buttons for settings, model downloader/ library, image generation category, video generation category
you can change how the app is structured, just ensure there is a cohesive, and most importantly pretty look and feel to it all, consider adding subtle animations and effects to enhance the UI.

Treat this project as an actual app thats going to be published live, it should be suitable for human maintenence and development, with extensive comments and documentation. Create a README.md with details on the project, how to install, and so on, styled suitable for github-ready uploading
Ensure you update documentation when changes are made, and always commit any changes to git.

i cant stress enough on how important it is to create thourough doucmentation for this, you should have seperate documentation for users, with how tos, troubleshooting, and so on, alongside developer documentation, with everything a developer needs to be onboarded with the project.

INITIALLY, develop a plan to tackle this task, with how your going to go about completing this project one phase at a time, save this as plan.md, also make this pretty and ready for github uploading

also did i mention the GUI should be really pretty?