# LazForge v2.0

**Project Command Center** — a dark-luxury PWA for tracking repairs, builds, restorations, and software projects.

## Features
- 🔧 5 project templates (Repair, Restore, Build, Software, Hardware) + custom
- 📝 Forge Log with collapsible entries and AI/Manual type distinction
- 🔩 Bill of Materials with Actual vs Budget variance tracking
- 📄 Document Vault — link PDFs hosted in LazForgeDocs repo
- 🏷️ Tags per project, searchable
- 📒 Scratch Pad — quick notes per project
- 💡 AI Brainstorm (Groq) → Forge to Log
- 🤖 AI Project Summary with copy + print
- 📥 AI Scan Import — paste Gemini/ChatGPT output, Groq parses it into a full project
- 🔍 Full-text search across all project data
- ⊞ Grid / ☰ Stack view toggle
- ⎙ Print selector — choose which projects to print
- ⚡ Activity light — live API connection status

## Deploy to GitHub Pages

1. Create a repo named `lazforge` at `github.com/yourusername/lazforge`
2. Upload all files from this zip to the repo root
3. Go to **Settings → Pages → Source: Deploy from branch → main → / (root)**
4. Your app will be live at `https://yourusername.github.io/lazforge/`

## Add Your Groq API Key
1. Get a free key at [console.groq.com](https://console.groq.com)
2. Open LazForge → Settings gear (⚙) → paste key → Save
3. The activity light turns green when connected

## Document Vault Setup (optional)
Create a second repo named `LazForgeDocs` and upload PDFs there.
Link them in the Vault tab using the GitHub blob URL:
`https://github.com/yourusername/LazForgeDocs/blob/main/your-file.pdf`

## Local Development
```bash
# Serve locally (required for API calls — file:// won't work)
npx serve .
# or
python3 -m http.server 8080
```

## Data Storage
All project data is stored in `localStorage` on your device. Export a JSON backup via Settings → Export JSON Backup.

---
Built with the Lazzaro Standard design system. Part of the johnlaz.github.io app portfolio.
