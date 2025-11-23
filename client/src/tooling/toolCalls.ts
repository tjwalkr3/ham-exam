import type { ToolArray } from "../zod-types/toolModel";

const baseToolCalls: ToolArray = [
  {
    type: "function",
    function: {
      name: "select_subsection_for_quiz",
      description: "Selects the best subsection for the user to study next, prioritizing the lowest achieved/total mastery ratio.",
      parameters: {
        type: "object",
        properties: {
          subsectionCode: {
            type: "string",
            description: "The subsection code that should be suggested to the student (e.g., 'T1A').",
          },
          reason: {
            type: "string",
            description: "One sentence explaining why this subsection was selected.",
          },
        },
        required: ["subsectionCode"],
      },
    },
  },
];

export function getToolCalls() {
  return baseToolCalls;
}

export type { ToolArray };
