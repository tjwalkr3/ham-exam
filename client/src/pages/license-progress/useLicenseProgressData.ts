import { useEffect, useMemo } from 'react'
import { useSubsectionMasteries } from '../../hooks/quizHooks'
import { useAiMessages } from '../../hooks/aiHooks'
import type { LicenseClass } from '../../context/settingsContext'
import {
  buildOutlookMessages,
  parseLicenseOutlook,
  resolveOutlookColor,
  summarizeMasteries,
  type MasterySummary,
} from './licenseProgressUtils'

type SetOutlookFn = (licenseClass: LicenseClass, outlook: string, colorHex: string, reason: string) => void

interface LicenseCardData {
  license: LicenseClass
  summary: MasterySummary
  query: ReturnType<typeof useSubsectionMasteries>
}

interface UseLicenseProgressDataParams {
  token: string
  isAuthenticated: boolean
  setOutlook: SetOutlookFn
}

export function useLicenseProgressData({ token, isAuthenticated, setOutlook }: UseLicenseProgressDataParams) {
  const technician = useSubsectionMasteries('T', token)
  const general = useSubsectionMasteries('G', token)
  const extra = useSubsectionMasteries('E', token)

  const summaries = useMemo<Record<LicenseClass, MasterySummary>>(() => ({
    T: summarizeMasteries(technician.data),
    G: summarizeMasteries(general.data),
    E: summarizeMasteries(extra.data),
  }), [technician.data, general.data, extra.data])

  const outlookMessages = useMemo(() => ({
    T: buildOutlookMessages('T', summaries.T),
    G: buildOutlookMessages('G', summaries.G),
    E: buildOutlookMessages('E', summaries.E),
  }), [summaries])

  const technicianOutlook = useAiMessages({
    token,
    messages: outlookMessages.T,
    enabled: Boolean(isAuthenticated && token),
    queryKey: ['license-outlook', 'T', summaries.T.earned, summaries.T.total],
  })
  const generalOutlook = useAiMessages({
    token,
    messages: outlookMessages.G,
    enabled: Boolean(isAuthenticated && token),
    queryKey: ['license-outlook', 'G', summaries.G.earned, summaries.G.total],
  })
  const extraOutlook = useAiMessages({
    token,
    messages: outlookMessages.E,
    enabled: Boolean(isAuthenticated && token),
    queryKey: ['license-outlook', 'E', summaries.E.earned, summaries.E.total],
  })

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    const updates = [
      parseLicenseOutlook(technicianOutlook.data?.toolCalls),
      parseLicenseOutlook(generalOutlook.data?.toolCalls),
      parseLicenseOutlook(extraOutlook.data?.toolCalls),
    ]
    updates.forEach((result) => {
      if (!result) {
        return
      }
      const color = resolveOutlookColor(result.outlook, result.colorHex)
      setOutlook(result.licenseClass, result.outlook, color, result.reason)
    })
  }, [isAuthenticated, technicianOutlook.data, generalOutlook.data, extraOutlook.data, setOutlook])

  const cards: LicenseCardData[] = [
    { license: 'T', query: technician, summary: summaries.T },
    { license: 'G', query: general, summary: summaries.G },
    { license: 'E', query: extra, summary: summaries.E },
  ]

  return { cards }
}

export type { LicenseCardData }
