# TwinAI - React Frontend

This is the React version of the TwinAI application, refactored from plain HTML/CSS/JavaScript to a modern React architecture using Vite.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── AuthModal.jsx    # Authentication modal (sign in/sign up)
│   │   ├── ChatMessage.jsx  # Individual chat message bubble
│   │   ├── ChatSidebar.jsx  # Sidebar with chat history
│   │   ├── SettingsModal.jsx # User settings modal
│   │   └── UpgradeModal.jsx  # Upgrade to Pro modal
│   ├── pages/               # Page components
│   │   ├── Landing.jsx      # Landing page (from index.html)
│   │   ├── ChatApp.jsx      # Main chat application (from app.html)
│   │   └── Pricing.jsx      # Pricing page (from pricing.html)
│   ├── lib/                 # Utility modules
│   │   ├── supabase.js      # Supabase client and database functions
│   │   ├── brain.js         # AI logic (OpenRouter API calls)
│   │   └── fileExtraction.js # File extraction utilities (OCR, PDF parsing)
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles (migrated from HTML)
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

## File Mapping

### Original → React
- `index.html` → `src/pages/Landing.jsx`
- `app.html` → `src/pages/ChatApp.jsx`
- `pricing.html` → `src/pages/Pricing.jsx`
- `supabase-auth.js` → `src/lib/supabase.js`
- `brain.js` → `src/lib/brain.js`
- `payment.js` → Integrated into `src/pages/Pricing.jsx`
- All CSS styles → `src/index.css`

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build

```bash
npm run build
```

## Key Features Preserved

✅ All Supabase authentication logic (sign up, sign in, logout, session management)
✅ All database operations (chats, messages, profiles)
✅ Daily limit checking for free users
✅ AI consensus engine (Agent A, Agent B, Consensus via OpenRouter)
✅ File upload and extraction (images via OCR, PDFs, text files)
✅ Chat history and management
✅ Settings modal
✅ Upgrade modal
✅ Payment integration (LemonSqueezy)
✅ Exact same UI/UX as original

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling (via CDN in original, now via npm)
- **Supabase** - Backend (auth, database)
- **OpenRouter API** - AI model calls
- **Tesseract.js** - OCR for images
- **PDF.js** - PDF text extraction
- **Marked** - Markdown parsing
- **LemonSqueezy** - Payment processing

## Notes

- All functionality, behavior, and UI remain exactly the same as the original
- No changes to API behavior, database structure, or authentication flow
- The refactor is purely architectural - converting to React patterns while preserving 100% of functionality

