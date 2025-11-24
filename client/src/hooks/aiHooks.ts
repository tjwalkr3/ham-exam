import { useQuery } from "@tanstack/react-query";
import { fetchWrapper } from "../utils/fetchWrapper";
import { ChatResponseSchema, type ChatResponse } from "../zod-types/chatResponseModel";
import type { MessageArray } from "../zod-types/messageModel";
import { getToolCalls } from "../tooling/toolCalls";

interface AiMessageParams {
  token: string;
  messages?: MessageArray;
  enabled?: boolean;
  queryKey: unknown[];
}

async function requestAiMessages(token: string, messages: MessageArray): Promise<ChatResponse> {
  if (!messages.length) {
    throw new Error("Messages are required for AI requests");
  }

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

export function useAiMessages({ token, messages, enabled = true, queryKey }: AiMessageParams) {
  return useQuery({
    queryKey: ["ai-messages", ...queryKey],
    enabled: Boolean(enabled && token && messages?.length),
    queryFn: () => requestAiMessages(token, messages as MessageArray),
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}

export type { AiMessageParams };
