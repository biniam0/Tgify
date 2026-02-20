import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const formSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  model: z.enum(['gpt', 'gemini', 'deepseek', 'grok']),
  channelId: z.string().url('Must be a valid URL (e.g., https://t.me/ja_stler)'),
  dateRange: z.object({
    from: z.date({ required_error: 'Start date is required' }),
    to: z.date({ required_error: 'End date is required' }),
  }),
})

type FormData = z.infer<typeof formSchema>

interface SummarizerFormProps {
  onSubmit: (data: FormData) => void
  isLoading: boolean
}

export function SummarizerForm({ onSubmit, isLoading }: SummarizerFormProps) {
  const [date, setDate] = useState<{ from: Date; to: Date } | undefined>()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: 'gpt',
    },
  })

  // Sync date range with form
  const handleDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range?.to) {
      setDate({ from: range.from, to: range.to })
      setValue('dateRange', { from: range.from, to: range.to })
    } else {
        // Handle partial selection if needed, or just wait for both
        if (range?.from) {
             setDate({ from: range.from, to: range.from }) // Temporary set to avoid type errors if needed
        }
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Telegram Channel Summarizer</CardTitle>
        <CardDescription>
          Enter your API key, channel link, and date range to get a summary.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              {...register('apiKey')}
            />
            {errors.apiKey && (
              <p className="text-sm text-destructive">{errors.apiKey.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Select
              onValueChange={(value) =>
                setValue('model', value as 'gpt' | 'gemini' | 'deepseek' | 'grok')
              }
              defaultValue={watch('model')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt">GPT-4 (OpenAI)</SelectItem>
                <SelectItem value="gemini">Gemini (Google)</SelectItem>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
                <SelectItem value="grok">Grok (xAI)</SelectItem>
              </SelectContent>
            </Select>
            {errors.model && (
              <p className="text-sm text-destructive">{errors.model.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="channelId">Telegram Channel Link</Label>
            <Input
              id="channelId"
              placeholder="https://t.me/ja_stler"
              {...register('channelId')}
            />
            {errors.channelId && (
              <p className="text-sm text-destructive">
                {errors.channelId.message}
              </p>
            )}
          </div>

          <div className="space-y-2 flex flex-col">
            <Label>Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y')} -{' '}
                        {format(date.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={(range: any) => handleDateSelect(range)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {errors.dateRange && (
              <p className="text-sm text-destructive">
                {errors.dateRange.root?.message || "Date range is required"}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              'Summarize Posts'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
