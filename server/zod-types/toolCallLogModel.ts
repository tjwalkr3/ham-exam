import { z } from "zod";

export const ToolCallLogSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  timestamp: z.union([z.string(), z.date()]),
  toolcall_description: z.string(),
});

export const ToolCallLogArraySchema = z.array(ToolCallLogSchema);

export type ToolCallLog = z.infer<typeof ToolCallLogSchema>;
export type ToolCallLogArray = z.infer<typeof ToolCallLogArraySchema>;
