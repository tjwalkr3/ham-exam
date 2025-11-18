import { z } from "zod";

export const ToolSchema = z.object({
  type: z.literal("function"),
  function: z.object({
    name: z.string(),
    description: z.string(),
    parameters: z.object({
      type: z.literal("object"),
      properties: z.record(z.string(), z.any()),
      required: z.array(z.string()),
    }),
  }),
});

export const ToolArraySchema = z.array(ToolSchema);

export type Tool = z.infer<typeof ToolSchema>;
export type ToolArray = z.infer<typeof ToolArraySchema>;
