# Project Structure Documentation

## Folder Structure

```
frontend/
├── src/
│   ├── components/              # Reusable React components
│   │   ├── AuthModal.jsx       # Authentication modal (sign in/sign up)
│   │   ├── ChatMessage.jsx     # Individual chat message bubble with actions
│   │   ├── ChatSidebar.jsx     # Sidebar with chat history and navigation
│   │   ├── SettingsModal.jsx   # User settings and account management
│   │   └── UpgradeModal.jsx    # Upgrade to Pro prompt modal
│   │
│   ├── pages/                  # Page-level components
│   │   ├── Landing.jsx         # Landing page (converted from index.html)
│   │   ├── ChatApp.jsx         # Main chat application (converted from app.html)
│   │   └── Pricing.jsx         # Pricing page (converted from pricing.html)
│   │
│   ├── lib/                    # Utility modules and services
│   │   ├── supabase.js         # Supabase client and all database/auth functions
│   │   ├── brain.js            # AI logic (OpenRouter API integration)
│   │   └── fileExtraction.js   # File extraction utilities (OCR, PDF parsing)
│   │
│   ├── App.jsx                 # Main app component with React Router
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles (all CSS from original HTML files)
│
├── index.html                  # HTML template (Vite entry point)
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

## File Mapping: Original → React

| Original File | New Location | Notes |
|--------------|--------------|-------|
| `index.html` | `src/pages/Landing.jsx` | Landing page with hero section and auth |
| `app.html` | `src/pages/ChatApp.jsx` | Main chat application |
| `pricing.html` | `src/pages/Pricing.jsx` | Pricing/upgrade page |
| `supabase-auth.js` | `src/lib/supabase.js` | Supabase client and all DB/auth functions |
| `brain.js` | `src/lib/brain.js` | AI consensus engine logic |
| `payment.js` | Integrated into `src/pages/Pricing.jsx` | Payment logic integrated into component |
| All `<style>` tags | `src/index.css` | All CSS consolidated |

## Component Breakdown

### Pages

#### Landing.jsx
- **Purpose**: Landing page with hero section, demo animation, and authentication
- **Features**:
  - Hero section with animated demo chat
  - Authentication modal (sign in/sign up)
  - Navigation to app and pricing
  - "How it Works" section
- **State**: Auth modal open/close, authentication status
- **Dependencies**: `AuthModal`, `supabase`

#### ChatApp.jsx
- **Purpose**: Main chat application with sidebar, messages, and file upload
- **Features**:
  - Chat sidebar with history
  - Message display with markdown rendering
  - File upload and extraction (images, PDFs, text)
  - Settings modal
  - Upgrade modal
  - Agent A, Agent B, Consensus flow
- **State**: 
  - Current chat ID
  - Messages array
  - User data
  - Processing states
  - File upload state
  - Modal states
- **Dependencies**: `ChatSidebar`, `ChatMessage`, `SettingsModal`, `UpgradeModal`, all lib modules

#### Pricing.jsx
- **Purpose**: Pricing page with upgrade functionality
- **Features**:
  - Pricing cards display
  - LemonSqueezy payment integration
  - Pro status detection
- **State**: Price, loading state, pro status, login status
- **Dependencies**: `supabase`, LemonSqueezy (CDN)

### Components

#### AuthModal.jsx
- **Purpose**: Authentication modal for sign in/sign up
- **Props**: `isOpen`, `onClose`, `initialMode`
- **State**: Form fields, error messages, loading state
- **Functions**: Sign up, sign in, mode toggle

#### ChatMessage.jsx
- **Purpose**: Individual message bubble with actions
- **Props**: `role`, `agent`, `content`, `animate`
- **Features**: 
  - Markdown rendering
  - Copy, share, speak actions
  - Different styling for user/agent/system messages
- **State**: Speaking state for text-to-speech

#### ChatSidebar.jsx
- **Purpose**: Sidebar with chat history and navigation
- **Props**: `chats`, `currentChatId`, callbacks, `user`, `isProUser`
- **Features**:
  - Chat list with active state
  - New chat button
  - Upgrade button (or Pro badge)
  - User profile section
  - Settings trigger

#### SettingsModal.jsx
- **Purpose**: User settings and account management
- **Props**: `isOpen`, `onClose`, `user`, `isProUser`, `onUpdate`
- **Features**:
  - Email display
  - Plan badge
  - Name editing
  - Logout

#### UpgradeModal.jsx
- **Purpose**: Modal prompting user to upgrade
- **Props**: `isOpen`, `onClose`
- **Features**: Upgrade prompt with link to pricing page

### Lib Modules

#### supabase.js
- **Exports**:
  - `supabase` - Supabase client instance
  - `signUp`, `signIn`, `logout` - Auth functions
  - `requireAuth`, `updateUserProfile` - Auth utilities
  - `dbFetchChats`, `dbCreateChat`, `dbFetchMessages`, `dbSaveMessage`, `dbDeleteChat` - DB functions
  - `checkDailyLimit` - Limit checking function

#### brain.js
- **Exports**:
  - `callTwinFunction(stage, context)` - Main AI function
- **Stages**: `'agent-a'`, `'agent-b'`, `'consensus'`
- **Models**: Different models for each stage via OpenRouter API

#### fileExtraction.js
- **Exports**:
  - `extractTextFromFile(file)` - Extract text from images, PDFs, or text files
- **Features**:
  - OCR for images (Tesseract.js)
  - PDF text extraction (PDF.js)
  - Text file reading (FileReader API)

## Routing

React Router configuration in `App.jsx`:
- `/` → `Landing` component
- `/app` → `ChatApp` component (protected by `requireAuth`)
- `/pricing` → `Pricing` component
- `*` → Redirect to `/`

## State Management

All state is managed using React hooks (`useState`, `useEffect`) at the component level. No global state management library is used.

## Styling

- **Tailwind CSS**: Utility-first CSS framework (via npm, not CDN)
- **Custom CSS**: All custom styles from original HTML files in `src/index.css`
- **Responsive**: All responsive breakpoints preserved from original

## Dependencies

### Runtime
- `react`, `react-dom` - React framework
- `react-router-dom` - Client-side routing
- `@supabase/supabase-js` - Supabase client
- `marked` - Markdown parsing
- `tesseract.js` - OCR for images
- `pdfjs-dist` - PDF parsing

### Development
- `vite` - Build tool and dev server
- `@vitejs/plugin-react` - Vite React plugin
- `tailwindcss`, `postcss`, `autoprefixer` - CSS tooling
- `@types/react`, `@types/react-dom` - TypeScript types (for better IDE support)

## External Dependencies (CDN)

These are loaded via script tags in `index.html`:
- Font Awesome - Icon library
- LemonSqueezy - Payment processing (loaded dynamically)

## Build & Development

- **Development**: `npm run dev` - Starts Vite dev server (port 3000)
- **Build**: `npm run build` - Creates production build in `dist/`
- **Preview**: `npm run preview` - Preview production build

## Notes

- All functionality from the original project is preserved
- No changes to API behavior, database structure, or authentication flow
- UI/UX remains exactly the same
- The refactor is purely architectural - converting to React patterns while maintaining 100% functional equivalence

