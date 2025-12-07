import type { MessageArray } from '../../../zod-types/messageModel'

type ToolCall = {
  function?: {
    name?: string
    arguments?: string
  }
}

const padTwo = (value: number) => String(value).padStart(2, '0')

export const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${padTwo(days)}d ${padTwo(hours)}h ${padTwo(minutes)}m ${padTwo(seconds)}s`
}

export const buildCountdownMessages = (targetValue: string): MessageArray =>
  targetValue
    ? [
        {
          role: 'system' as const,
          content: [
            'You are a precise function-calling agent for a ham exam app.',
            "Always respond with exactly one tool call to 'start_exam_countdown'.",
            'Never return prose, markdown, JSON, or explanations.',
            'Parse the user-provided datetime and pass it as ISO 8601 with timezone (e.g., 2025-02-03T09:00:00Z) under the argument name `targetTime`.',
            'If the input is ambiguous or invalid, still call the tool with a best-effort ISO guess; do not write text responses.',
          ].join(' '),
        },
        {
          role: 'user' as const,
          content: `Start a countdown for ${targetValue}`,
        },
      ]
    : []

export const toLocalDateTimeInputValue = (examDate: string | null) => {
  if (!examDate) return ''

  const date = new Date(examDate)
  if (Number.isNaN(date.getTime())) return ''

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export const parseCountdownTargetTime = (toolCalls?: ToolCall[] | null) => {
  const toolCall = toolCalls?.find((call) => call.function?.name === 'start_exam_countdown')
  if (!toolCall?.function?.arguments) return { iso: null as string | null, parsed: null as number | null }

  const args = JSON.parse(toolCall.function.arguments) as { targetTime?: string }
  const iso = args?.targetTime ?? null
  const parsed = iso ? new Date(iso).getTime() : NaN

  if (!iso || Number.isNaN(parsed)) return { iso: null, parsed: null }

  return { iso, parsed }
}

export const getCountdownStatus = (targetTime: number) => {
  const remaining = targetTime - Date.now()
  const expired = remaining <= 0
  const display = expired ? '00d 00h 00m 00s' : formatDuration(remaining)

  return { display, expired }
}
