import { toast } from 'react-hot-toast'

const defaultMessage = 'Unable to complete that action. Please try again.'

export function handleQueryError(error: unknown) {
  const message = extractMessage(error)
  toast.error(message)
}

function extractMessage(error: unknown) {
  if (typeof error === 'string' && error.trim()) {
    return error
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return defaultMessage
}
