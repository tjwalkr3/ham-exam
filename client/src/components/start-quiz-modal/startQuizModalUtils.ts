import type { MessageArray } from '../../zod-types/messageModel'
import type { SubsectionMasteries, SubsectionMastery } from '../../zod-types/subsectionMasteryModel'
import type { ToolCall } from '../../zod-types/toolCallModel'

export type AiSelection = {
  subsectionCode: string
  reason?: string
  confidence?: number
}

const PERFECT_RATIO = 1

function getMasteryRatio(subsection: SubsectionMastery) {
  return !subsection.totalMastery ? PERFECT_RATIO : subsection.achievedMastery / subsection.totalMastery
}

export function selectLowestMastery(list?: SubsectionMastery[]) {
  if (!list?.length) return undefined
  return list.reduce<SubsectionMastery>((lowest, current) =>
    getMasteryRatio(current) < getMasteryRatio(lowest) ? current : lowest
  , list[0])
}

export function buildSubsectionMessages(licenseClass: string, masteries?: SubsectionMasteries): MessageArray | null {
  if (!masteries?.length) {
    return null
  }
  return [
    {
      role: 'system',
      content: 'You are an AI tutor who selects the best ham radio subsection for the next quiz. Always call the select_subsection_for_quiz tool with your final decision and only choose subsections present in the provided mastery data.',
    },
    {
      role: 'user',
      content: JSON.stringify({
        licenseClass,
        masteries,
        objective: 'Choose the subsection that maximizes learner progress',
      }),
    },
  ]
}

export function parseAiSelection(toolCalls?: ToolCall[]) {
  if (!toolCalls) { return null }
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
  if (!isAiMode) {
    return { recommendedSubsection: fallbackSubsection, isAiRecommendation: false }
  }
  if (aiRecommended) {
    return { recommendedSubsection: aiRecommended, isAiRecommendation: true }
  }
  return { recommendedSubsection: fallbackSubsection, isAiRecommendation: false }
}
