# GFGBQ-Team-first-commit

# AI Hallucination and Citation Verification System

# TwinAI

TwinAI is a powerful AI-driven application that utilizes multiple agents to provide verified, high-quality responses. It integrates OpenRouter for AI models and Supabase for backend services, including authentication and real-time database functionality.

## Deployed on vercel :
   
   - **https://gfgbq-team-first-commit.vercel.app/**
## PPT Link and Demo video: 

   - **https://drive.google.com/file/d/1oE46wYFclL5XQLv_f5mJ6FgT33dFLHng/view?usp=sharing**
   - **https://drive.google.com/file/d/1JPxHuCeSLDXWwPNQUKBzPvkAhbzUBvHJ/view?usp=sharing**

## Features

- **Multi-Agent Consensus**: Uses Gemini,Grok and NVIDIA Nemotron models to research and verify information.
- **Source Verification**: Automatically provides real source URLs for claims made in the AI reports.
- **Secure Authentication**: Built with Supabase Auth for safe and easy user management.
- **Real-time Database**: Stores chats and messages securely using Supabase.
- **Modern Tech Stack**: Built with React, Vite, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- Supabase account and project
- OpenRouter API key

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
### Project Structure

```txt
src/
├── Assets/
│   └── (Static assets like images, icons, etc.)
│
├── components/
│   ├── AuthModal.jsx        # Authentication (login/signup) modal
│   ├── ChatMessage.jsx     # Single chat message UI
│   ├── ChatSidebar.jsx     # Sidebar for chats / navigation
│   ├── SettingsModal.jsx   # User/app settings modal
│   └── UpgradeModal.jsx    # Plan / upgrade modal
│
├── lib/
│   ├── brain.js            # Core chat / AI logic
│   ├── fileExtraction.js  # File parsing & content extraction
│   └── supabase.js        # Supabase client & helpers
│
├── pages/
│   └── (Route-level pages)
│
├── App.jsx                 # Root React component
├── main.jsx                # Application entry point
└── index.css               # Global styles
