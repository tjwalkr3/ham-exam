import OpenAI from "openai";
import type { MessageArray } from "../zod-types/messageModel.js";
import type { ToolArray } from "../zod-types/toolModel.js";
import type { ChatResponse } from "../zod-types/chatResponseModel.js";
import type { ToolCall } from "../zod-types/toolCallModel.js";
import { logToolCall } from "./toolCallService.js";

const aiServerUrl = process.env.AI_SERVER_URL ?? process.env.AI_SERVER;
if (!aiServerUrl) throw new Error("AI_SERVER_URL is not set");

const aiToken = process.env.AI_TOKEN;
if (!aiToken) throw new Error("AI_TOKEN is not set");

const aiModel = process.env.AI_MODEL ?? "gemma3-27b";
const aiTemperature = Number(process.env.AI_TEMPERATURE ?? "0.1");
const maxCompletionTokens = Number(process.env.AI_MAX_TOKENS ?? "800");

const openai = new OpenAI({
  apiKey: aiToken,
  baseURL: aiServerUrl,
});

export async function sendAiMessage(username: string, messages: MessageArray, tools?: ToolArray): Promise<ChatResponse> {
  const completion = await openai.chat.completions.create({
    model: aiModel,
    messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    temperature: aiTemperature,
    max_completion_tokens: maxCompletionTokens,
    ...(tools ? { tools: tools as OpenAI.Chat.Completions.ChatCompletionTool[] } : {}),
  });

  const assistantMessage = completion.choices[0]?.message;
  if (!assistantMessage) {
    throw new Error("No response received from AI service");
  }

  const toolCalls = assistantMessage.tool_calls?.length
    ? assistantMessage.tool_calls.map((toolCall): ToolCall => {
        if (toolCall.type !== "function" || !toolCall.function) {
          throw new Error(`Unsupported tool call type: ${toolCall.type}`);
        }

        return {
          id: toolCall.id,
          type: "function",
          function: {
            name: toolCall.function.name,
            arguments: toolCall.function.arguments ?? "{}",
          },
        };
      })
    : undefined;

  if (toolCalls) {
    for (const toolCall of toolCalls) {
      await logToolCall(username, toolCall);
    }
  }

  const responseText = normalizeContent(assistantMessage);

  return {
    response: responseText,
    toolCalls,
  };
}

function normalizeContent(message: OpenAI.Chat.Completions.ChatCompletionMessage): string | undefined {
  const { content } = message;
  if (!content) return undefined;

  if (typeof content === "string") {
    const trimmed = content.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (Array.isArray(content)) {
    type ContentPart = string | { type?: string; text?: string };
    const parts = content as ContentPart[];
    const combined = parts
      .map((part) => {
        if (typeof part === "string") return part;
        if (part.type === "text" && part.text) {
          return part.text;
        }
        return "";
      })
      .join("")
      .trim();
    return combined.length > 0 ? combined : undefined;
  }

  return undefined;
}
