# Tgify - Telegram Channel Summarizer

A simple web application to summarize Telegram channel posts using AI.

## Tech Stack

- **Framework**: React (Vite)
- **UI**: Shadcn UI (Tailwind CSS)
- **State Management**: React State (Local)
- **API**: Axios (for fetching), Vercel AI SDK (for summarization)
- **Date Handling**: date-fns

## Folder Structure

The project follows a feature-based architecture:

```
src/
├── app/              # Application entry: routes, global providers, entry point
├── assets/           # Global static files (images, fonts, icons)
├── components/       # Shared UI library (Button, Input, Modal, Table)
├── config/           # Global constants and environment variables
├── features/         # The core of the app (organized by business domain)
│   └── summarizer/   # Feature: Telegram Post Summarizer
│       ├── api/      # Feature-specific API calls (Mocked for demo)
│       ├── components/ # Components used ONLY in this feature
│       ├── services/ # Feature-specific services (AI integration)
│       ├── types/    # TypeScript interfaces for this feature
│       └── index.ts  # Public API (exports only what other features can see)
├── hooks/            # Global reusable hooks
├── lib/              # Pre-configured third-party libraries (utils)
├── providers/        # Global context providers
├── services/         # Global API or external service integrations
├── types/            # App-wide TypeScript definitions
├── utils/            # Pure helper functions
└── testing/          # Test utilities
```

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open in Browser**:
    Navigate to `http://localhost:5173`

## Note on API Usage

-   **Telegram API**: The app currently uses a mock function `fetchTelegramPosts` in `src/features/summarizer/api/telegram.ts` to simulate fetching posts. In a real scenario, this would connect to a backend service or a Telegram proxy.
-   **AI SDK**: The app simulates the AI summarization in `src/features/summarizer/services/aiService.ts`. To use real AI models, uncomment the code in that file and ensure you have the necessary Vercel AI SDK providers configured.
