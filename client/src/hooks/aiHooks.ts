import { useQuery } from "@tanstack/react-query";
import { fetchWrapper } from "../utils/fetchWrapper";
import { ChatResponseSchema, type ChatResponse } from "../zod-types/chatResponseModel";
import type { MessageArray } from "../zod-types/messageModel";
import type { SubsectionMasteries } from "../zod-types/subsectionMasteryModel";
import { getToolCalls } from "../tooling/toolCalls";

interface AiSubsectionParams {
  licenseClass: string;
  masteries?: SubsectionMasteries;
  token: string;
  enabled: boolean;
}

async function requestAiSubsection({
  licenseClass,
  masteries,
  token,
}: Omit<AiSubsectionParams, "enabled">): Promise<ChatResponse> {
  if (!masteries || masteries.length === 0) {
    throw new Error("Mastery data is required for AI selection");
  }

  const messages: MessageArray = [
    {
      role: "system",
      content:
        "You are an AI tutor who selects the best ham radio subsection for the next quiz. Always call the select_subsection_for_quiz tool with your final decision and only choose subsections present in the provided mastery data.",
    },
    {
      role: "user",
      content: JSON.stringify({
        licenseClass,
        masteries,
        objective: "Choose the subsection that maximizes learner progress",
      }),
    },
  ];

  const data = await fetchWrapper<unknown>("/api/ai/messages", {
    method: "POST",
    body: JSON.stringify({
      messages,
      tools: getToolCalls(),
    }),
    token,
  });

  return ChatResponseSchema.parse(data);
}

export function useAiSubsectionRecommendation(params: AiSubsectionParams) {
  const { enabled, token, licenseClass, masteries } = params;

  return useQuery({
    queryKey: [
      "ai-subsection",
      licenseClass,
      masteries ? JSON.stringify(masteries) : null,
    ],
    enabled: Boolean(enabled && token && masteries?.length),
    queryFn: () => requestAiSubsection({ licenseClass, masteries, token }),
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}
