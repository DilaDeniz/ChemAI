<div align="center">
  <img width="1200" height="475" alt="ChemAI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  <h1>ChemAI</h1>
  <p><strong>AI-powered chemical computation and drug discovery assistant</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Gemini-2.5_Pro-4285F4?logo=google&logoColor=white" alt="Gemini" />
    <img src="https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white" alt="Vite" />
  </p>
</div>

---

## Overview

ChemAI is a research-grade web application that uses Google Gemini to analyze chemical compounds and drugs. Enter a compound name and get back a structured report covering its properties, mechanism of action, side effects, and predicted interactions — all grounded in real-time web search.

Designed for research institutions and professionals who need fast, reliable chemical intelligence without wading through disconnected databases.

## Features

- **Compound Analysis** — General information, IUPAC name, molecular formula, physical description, history, and documented uses
- **Clinical Summary** — Mechanism of action, known side effects, and drug interaction risks
- **Interaction Prediction** — Predicts interactions with 5+ common drugs or chemicals and proposes optimized formulations to minimize adverse effects
- **Physicochemical Properties** — Molecular weight, melting/boiling point, density, and more, rendered as interactive charts
- **Scientific Term Tooltips** — Inline definitions for technical terminology, surfaced on hover
- **Search History** — Sidebar history with one-click reload and export to text file
- **Bilingual Interface** — Full English / Turkish support; language toggle translates all displayed content on the fly via Gemini Flash
- **Source Attribution** — Citations from Google Search grounding displayed alongside every result

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19, TypeScript 5.8 |
| Build Tool | Vite 6.2 |
| Styling | Tailwind CSS |
| AI | Google Gemini 2.5 Pro (analysis) + 2.5 Flash (translation/autocomplete) |
| Charts | Recharts 2.13 |
| Search Grounding | Google Search API (via Gemini) |

## Getting Started

**Prerequisites:** Node.js 18+

1. **Clone the repository**

   ```bash
   git clone https://github.com/diladeniz/chemai.git
   cd chemai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure your API key**

   Create a `.env.local` file in the project root:

   ```
   GEMINI_API_KEY=your_api_key_here
   ```

   Get a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

## Usage

1. Type a compound name (e.g. `Ibuprofen`, `Caffeine`, `Aspirin`) into the search bar
2. Optionally filter by formulation type: **Capsule**, **Liquid**, or **Tablet**
3. Press Enter or click Search
4. Results appear across three panels: **General Info**, **Findings**, and **Interactions**
5. Hover over highlighted terms to see inline scientific definitions
6. Toggle the language button in the header to switch between English and Turkish
7. Click any item in the sidebar history to reload a previous search
8. Use the Download button to export your search history

## Project Structure

```
ChemAI/
├── components/
│   ├── Header.tsx          # Top navigation bar and language toggle
│   ├── ControlPanel.tsx    # Search input, filters, and history sidebar
│   ├── DataPanel.tsx       # Results display (info, summary, interactions)
│   ├── SourcesPanel.tsx    # Citations from web search grounding
│   ├── Tooltip.tsx         # Scientific term tooltip component
│   └── GlobalStyles.tsx    # Global CSS overrides
├── contexts/
│   └── LocalizationContext.tsx   # EN/TR translation strings and context
├── services/
│   └── geminiService.ts    # Gemini API calls, prompts, and response parsing
├── utils/
│   └── download.ts         # History export to text file
├── types.ts                # Shared TypeScript interfaces
└── App.tsx                 # Root component and application state
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server on port 3000 |
| `npm run build` | Build for production (output to `dist/`) |
| `npm run preview` | Preview the production build locally |
