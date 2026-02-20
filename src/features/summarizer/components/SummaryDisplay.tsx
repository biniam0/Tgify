import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SummaryResult } from '../types'
import { ExternalLink } from 'lucide-react'

interface SummaryDisplayProps {
  result: SummaryResult
}

export function SummaryDisplay({ result }: SummaryDisplayProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{result.summary}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Source Posts ({result.sourcePosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {result.sourcePosts.map((post) => (
              <li key={post.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-muted-foreground mb-1">
                    {post.date.toLocaleDateString()}
                  </p>
                  <a
                    href={`https://t.me/${post.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center text-blue-500 hover:underline"
                  >
                    View on Telegram <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
                <p className="text-sm line-clamp-3">{post.content}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
