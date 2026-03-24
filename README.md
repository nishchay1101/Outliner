# DocToPage

**AI-Powered Document to Interactive Webpage Converter**

Upload a `.docx` file → Claude AI converts it into a beautifully structured, interactive webpage with block-based editing, drag-and-drop reordering, AI extension, and standalone HTML export.

---

## Features

- **AI Conversion** — Upload any `.docx` file and Claude converts it into structured blocks (hero, sections, tables, code, checklists, timelines, problems, and more)
- **10 Block Types** — hero, section, problem, tip, table, code, checklist, exercise, timeline, divider
- **Inline Editing** — Click any block to edit it in place; save/cancel per block
- **Drag-and-Drop Reorder** — Rearrange blocks with react-beautiful-dnd
- **Add Blocks** — Insert any block type via the slide-in panel
- **AI Extend** — Describe what you want to add and Claude generates a matching new block
- **SQLite Persistence** — All pages stored and fully CRUD-able
- **HTML Export** — Download a self-contained, styled HTML file (no external deps beyond Google Fonts)
- **Dark Design System** — Custom CSS variables, Syne/Space Mono/Inter fonts, yellow/red/green accents

---

## Prerequisites

- Node.js 18+
- npm 9+
- An Anthropic API key

---

## Setup

### 1. Clone / navigate to the project

```bash
cd doctopage
```

### 2. Add your Anthropic API key

Edit `.env` in the project root:

```env
ANTHROPIC_API_KEY=sk-ant-...your-key-here...
PORT=3001
DB_PATH=./data/pages.db
```

### 3. Install dependencies

```bash
# Install root + both workspaces
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 4. Run in development

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
Server starts at `http://localhost:3001`

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```
App opens at `http://localhost:5173`

### 5. Build for production

```bash
# Build frontend
cd client && npm run build

# Build backend
cd ../server && npm run build

# Start production server
npm start
```

---

## Project Structure

```
doctopage/
├── .env                          # API key + config
├── shared/
│   └── types.ts                  # All shared TypeScript types
├── client/                       # React 18 + Vite frontend
│   └── src/
│       ├── api/client.ts         # Axios API calls
│       ├── store/pageStore.ts    # Zustand global state
│       ├── hooks/                # useUpload, usePageEditor
│       ├── pages/                # Home, Editor, View
│       └── components/
│           ├── Upload/           # Drag-and-drop uploader
│           ├── Renderer/         # PageRenderer + 10 block components
│           ├── Editor/           # AddBlockPanel, ExtendPanel
│           ├── Sidebar/          # PageList
│           └── UI/               # Toolbar, Toast
└── server/                       # Express + TypeScript backend
    └── src/
        ├── routes/               # upload, pages, ai
        ├── services/             # docParser, claudeConverter, claudeExtender, htmlExporter
        ├── db/                   # schema.ts, pageRepo.ts (SQLite)
        └── index.ts
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload `.docx`, returns `{ pageId }` |
| GET | `/api/pages` | List all pages |
| GET | `/api/pages/:id` | Get full PageJSON |
| POST | `/api/pages` | Create blank page |
| PATCH | `/api/pages/:id` | Update page title / blocks |
| DELETE | `/api/pages/:id` | Delete page |
| POST | `/api/pages/:id/export` | Export as standalone HTML |
| POST | `/api/ai/extend` | Generate a new block with Claude |

---

## Block Types

| Type | Description |
|------|-------------|
| `hero` | Large title + subtitle + badge chips |
| `section` | Titled section with body text |
| `problem` | Coding problem card (steps, dry-run, complexity) |
| `tip` | Highlighted tip / note / warning callout |
| `table` | Data or dry-run table |
| `code` | Syntax-highlighted pseudocode block |
| `checklist` | Bulleted list of items |
| `exercise` | Homework/practice items with badges |
| `timeline` | Horizontal time-segment bar |
| `divider` | Visual separator (solid / dashed / gradient) |

---

## Design System

CSS custom properties defined in `client/src/styles/design-tokens.css`:

```css
--bg: #0a0a0f          /* Page background */
--surface: #12121a     /* Card background */
--border: #1e1e2e      /* Borders */
--accent: #f4c542      /* Yellow highlights */
--accent2: #e05c5c     /* Red warnings */
--accent3: #5cf4b4     /* Green insights */
--text: #e8e8f0        /* Body text */
--text-dim: #8080a0    /* Muted text */
--mono: 'Space Mono'   /* Code / labels */
--sans: 'Syne'         /* Headings */
--body: 'Inter'        /* Body text */
```

Background has a subtle CSS grid overlay (rgba yellow, 3% opacity, 40px grid).

---

## How It Works

1. **Upload** — You drag and drop a `.docx` file onto the upload zone
2. **Parse** — `mammoth` extracts raw text, headings, paragraphs, lists, and tables from the `.docx`
3. **Convert** — The extracted `DocContent` is sent to Claude (`claude-sonnet-4-20250514`) with a strict system prompt. Claude outputs a `PageJSON` object with typed blocks
4. **Store** — The `PageJSON` is persisted to SQLite via `better-sqlite3`
5. **Render** — The frontend fetches the `PageJSON` and renders each block with its matching React component
6. **Edit** — Toggle edit mode, click any block's ✏️ button to open an inline form editor, save block-by-block
7. **Extend** — Open the AI Extend panel, describe what you want, and Claude generates a new block that fits your content
8. **Export** — Click Export HTML to download a single self-contained `.html` file with all CSS inlined

---

## Troubleshooting

**"Only .docx files are accepted"** — Make sure you're uploading a `.docx` (not `.doc`, `.odt`, or `.pdf`)

**"Conversion failed"** — Check that `ANTHROPIC_API_KEY` is set correctly in `.env` and that you have API access

**Port conflicts** — Change `PORT` in `.env` and update the Vite proxy in `client/vite.config.ts` to match

**Database location** — By default `./data/pages.db` relative to the server directory. Change `DB_PATH` in `.env`
