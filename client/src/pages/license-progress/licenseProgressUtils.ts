import type { LicenseClass } from '../../context/settingsContext'
import type { SubsectionMasteries } from '../../zod-types/subsectionMasteryModel'
import type { MessageArray } from '../../zod-types/messageModel'
import type { ToolCall } from '../../zod-types/toolCallModel'
import { LICENSE_OUTLOOKS } from '../../toolCalls'

const PASS_THRESHOLD = 0.74
const STRONG_THRESHOLD = 0.8

export const LICENSE_DETAILS: Record<LicenseClass, { name: string }> = {
  T: { name: 'Technician' },
  G: { name: 'General' },
  E: { name: 'Extra' },
}

export interface MasterySummary {
  earned: number
  total: number
  percentage: number
}

export function summarizeMasteries(masteries?: SubsectionMasteries): MasterySummary {
  if (!masteries?.length) {
    return { earned: 0, total: 0, percentage: 0 }
  }

  const { earned, total } = masteries.reduce(
    (acc, item) => ({
      earned: acc.earned + item.achievedMastery,
      total: acc.total + item.totalMastery,
    }),
    { earned: 0, total: 0 },
  )

  const percentage = total ? Math.round((earned / total) * 100) : 0
  return { earned, total, percentage }
}

const outlookList = LICENSE_OUTLOOKS.map((option) => option.label).join(', ')
const outlookPalette = LICENSE_OUTLOOKS.map((option) => `${option.label}: ${option.colorHex}`).join(' | ')

export function buildOutlookMessages(licenseClass: LicenseClass, summary: MasterySummary): MessageArray {
  const licenseName = LICENSE_DETAILS[licenseClass].name

  return [
    {
      role: 'system',
      content: `You are an AI coach assessing ham radio exam readiness. Always respond with the set_license_outlook tool call. Choose exactly one outlook from: ${outlookList}. Match the outlook to this palette: ${outlookPalette}. Base your recommendation strictly on the provided earnedMastery and totalMastery values. Do not hallucinate mastery levels. Keep rationale to one sentence.`,
    },
    {
      role: 'user',
      content: JSON.stringify({
        licenseClass,
        licenseName,
        earnedMastery: summary.earned,
        totalMastery: summary.total,
        currentPercentage: `${summary.percentage}%`,
        passingThreshold: PASS_THRESHOLD,
        strongThreshold: STRONG_THRESHOLD,
        context: 'Assess likelihood of passing the upcoming exam with current mastery levels.',
      }),
    },
  ]
}

export interface ParsedOutlookCall {
  licenseClass: LicenseClass
  outlook: string
  colorHex: string
  reason: string
}

export function resolveOutlookColor(outlook: string, providedColor: string) {
  const match = LICENSE_OUTLOOKS.find((option) => option.label === outlook)
  return match ? match.colorHex : providedColor
}
export function parseLicenseOutlook(toolCalls?: ToolCall[]): ParsedOutlookCall | null {
  if (!toolCalls) return null
  for (const toolCall of toolCalls) {
    if (toolCall.function.name !== 'set_license_outlook') {
      continue
    }

    try {
      const args = JSON.parse(toolCall.function.arguments) as Partial<ParsedOutlookCall>
      if (
        args &&
        (args.licenseClass === 'T' || args.licenseClass === 'G' || args.licenseClass === 'E') &&
        typeof args.outlook === 'string' &&
        typeof args.colorHex === 'string' &&
        typeof args.reason === 'string'
      ) {
        return args as ParsedOutlookCall
      }
    } catch (error) {
      console.error('Failed to parse outlook tool call', error)
    }
  }

  return null
}
