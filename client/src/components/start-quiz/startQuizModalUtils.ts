import type { SubsectionMastery } from '../../zod-types/subsectionMasteryModel'
import type { ToolCall } from '../../zod-types/toolCallModel'

export type AiSelection = {
  subsectionCode: string
  reason?: string
  confidence?: number
}

export function selectLowestMastery(list?: SubsectionMastery[]) {
  if (!list || list.length === 0) {
    return undefined
  }
  return list.reduce<SubsectionMastery>((lowest, current) =>
    current.totalMastery < lowest.totalMastery ? current : lowest
  , list[0])
}

export function parseAiSelection(toolCalls?: ToolCall[]) {
  if (!toolCalls) {
    return null
  }

  for (const toolCall of toolCalls) {
    if (toolCall.function.name !== 'select_subsection_for_quiz') {
      continue
    }

    try {
      const args = JSON.parse(toolCall.function.arguments) as Partial<AiSelection>
      if (typeof args.subsectionCode !== 'string') {
        continue
      }
      return {
        subsectionCode: args.subsectionCode,
        reason: typeof args.reason === 'string' ? args.reason : undefined,
        confidence: typeof args.confidence === 'number' ? args.confidence : undefined,
      }
    } catch (error) {
      console.error('Failed to parse tool call arguments', error)
    }
  }

  return null
}

interface DetermineRecommendationParams {
  isAiMode: boolean
  aiSelection: AiSelection | null
  masteries?: SubsectionMastery[]
  fallbackSubsection?: SubsectionMastery
}

interface RecommendationResult {
  recommendedSubsection?: SubsectionMastery
  isAiRecommendation: boolean
}

export function determineRecommendation({
  isAiMode,
  aiSelection,
  masteries,
  fallbackSubsection,
}: DetermineRecommendationParams): RecommendationResult {
  const aiRecommended = aiSelection
    ? masteries?.find((subsection) => subsection.code === aiSelection.subsectionCode)
    : undefined

  if (isAiMode) {
    if (aiRecommended) {
      return { recommendedSubsection: aiRecommended, isAiRecommendation: true }
    }
    return { recommendedSubsection: fallbackSubsection, isAiRecommendation: false }
  }

  return { recommendedSubsection: fallbackSubsection, isAiRecommendation: false }
}
