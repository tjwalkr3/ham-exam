import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchWrapper } from "../utils/fetchWrapper";
import { ChatResponseSchema, type ChatResponse } from "../zod-types/chatResponseModel";
import type { MessageArray } from "../zod-types/messageModel";
import { getToolCalls } from "../tooling/toolCalls";
import type { Question } from '../zod-types/questionModel';

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

const urlToBase64 = async (url: string) => {
  const blob = await (await fetch(url)).blob();
  return new Promise<string>(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

function constructAiMessages(question: Question, selectedAnswerIndex: number, base64Image?: string) {
  const content = `Question: ${question.question}
Answers: ${question.answers.map((a, i) => `${String.fromCharCode(65 + i)}. ${a}`).join('\n')}
User Answer: ${String.fromCharCode(65 + selectedAnswerIndex)}. ${question.answers[selectedAnswerIndex]}
Correct Answer: ${String.fromCharCode(65 + question.correct)}. ${question.answers[question.correct]}`;

  return [
    {
      role: "system" as const,
      content: "You are a helpful assistant for a ham radio exam app. You will be given a question, answer choices, and the user's selected answer. If the user's answer is incorrect, call the 'explain_question_answer' tool with a 1-2 sentence plain text explanation of why it is wrong. If the answer is correct, do nothing."
    },
    {
      role: "user" as const,
      content: base64Image ? [{ type: "text" as const, text: content }, { type: "image_url" as const, image_url: { url: base64Image } }] : content
    }
  ];
}

export async function getAiExplanation(token: string, question: Question, selectedAnswerIndex: number): Promise<string | null> {
  const base64Image = question.figure 
    ? await urlToBase64(`/figures/${question.figure}`).catch(console.error) 
    : undefined;

  const messages = constructAiMessages(question, selectedAnswerIndex, base64Image as string | undefined);

  const response = await requestAiMessages(token, messages);
  
  const explanationTool = response.toolCalls?.find(t => t.function.name === 'explain_question_answer');
  if (explanationTool) {
    const args = JSON.parse(explanationTool.function.arguments);
    return args.explanation || null;
  }
  
  return null;
}

export function useAiExplanation(token: string) {
  return useMutation({
    mutationFn: ({ question, selectedAnswerIndex }: { question: Question; selectedAnswerIndex: number }) =>
      getAiExplanation(token, question, selectedAnswerIndex),
  });
}

export type { AiMessageParams };
