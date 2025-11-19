import { z } from "zod";
import { ToolCallSchema } from "./toolCallModel";

export const ChatResponseSchema = z.object({
  response: z.string().optional(),
  toolCalls: z.array(ToolCallSchema).optional(),
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;
