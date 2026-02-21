import { useState } from 'react'
import { SummarizerForm } from '@/features/summarizer/components/SummarizerForm'
import { SummaryDisplay } from '@/features/summarizer/components/SummaryDisplay'
import { fetchTelegramPosts } from '@/features/summarizer/api/telegram'
import { summarizePosts } from '@/features/summarizer/services/aiService'
import { SummaryResult } from '@/features/summarizer/types'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Github, Linkedin } from 'lucide-react'

function App() {
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSummarize = async (data: any) => {
    setIsLoading(true)
    setError(null)
    setSummaryResult(null)

    try {
      // 1. Fetch posts
      const posts = await fetchTelegramPosts(
        data.channelId,
        data.dateRange.from,
        data.dateRange.to
      )

      if (posts.length === 0) {
        setError('No posts found in the selected date range.')
        setIsLoading(false)
        return
      }

      // 2. Summarize posts
      const summary = await summarizePosts(posts, data.apiKey, data.model)

      setSummaryResult({
        summary,
        sourcePosts: posts,
      })
    } catch (err) {
      console.error(err)
      setError('An error occurred while processing your request.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8 font-sans antialiased relative">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.open('https://github.com/biniam0/Tgify', '_blank')}
        >
          <Github className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">GitHub</span>
        </Button>
        <ModeToggle />
      </div>
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Tgify</h1>
          <p className="text-muted-foreground text-lg">
            Summarize Telegram channel posts with AI.
          </p>
        </header>

        <main className="space-y-8">
          <SummarizerForm onSubmit={handleSummarize} isLoading={isLoading} />

          {error && (
            <div className="p-4 rounded-md bg-destructive/10 text-destructive text-center font-medium">
              {error}
            </div>
          )}

          {summaryResult && <SummaryDisplay result={summaryResult} />}
        </main>

        <footer className="text-center text-sm text-muted-foreground pt-8 flex items-center justify-center gap-1">
          Built with 💖, let's connect
          <a
            href="https://www.linkedin.com/in/imjaa/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center hover:text-foreground transition-colors"
          >
            <Linkedin className="h-4 w-4" />
            <span className="sr-only">LinkedIn</span>
          </a>
        </footer>
      </div>
    </div>
  )
}

export default App
