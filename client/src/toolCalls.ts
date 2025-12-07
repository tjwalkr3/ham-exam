import type { ToolArray } from "./zod-types/toolModel";

export const LICENSE_OUTLOOKS = [
  { label: "Excellent", colorHex: "#16a34a" },
  { label: "Encouraging", colorHex: "#4ade80" },
  { label: "Balanced", colorHex: "#facc15" },
  { label: "Risky", colorHex: "#ea580c" },
  { label: "Failing", colorHex: "#b91c1c" },
] as const;

const outlookLabels = LICENSE_OUTLOOKS.map((item) => item.label);
const licenseClasses = ["T", "G", "E"] as const;

const baseToolCalls: ToolArray = [
  {
    type: "function",
    function: {
      name: "select_subsection_for_quiz",
      description:
        "Selects the best subsection for the user to study next, prioritizing the lowest achieved/total mastery ratio.",
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
  {
    type: "function",
    function: {
      name: "set_license_outlook",
      description:
        "Assigns a pass/fail outlook for a given license class. Choose one approved outlook label and provide a matching color hex along with a one-sentence rationale.",
      parameters: {
        type: "object",
        properties: {
          licenseClass: {
            type: "string",
            enum: licenseClasses,
            description: "License class identifier: 'T' for Technician, 'G' for General, 'E' for Extra.",
          },
          outlook: {
            type: "string",
            enum: outlookLabels,
            description: "One of the approved outlook descriptors.",
          },
          colorHex: {
            type: "string",
            description: "Hex color representing the outlook (e.g., '#16a34a').",
          },
          reason: {
            type: "string",
            description: "One concise sentence describing why this outlook was selected.",
          },
        },
        required: ["licenseClass", "outlook", "colorHex", "reason"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "explain_question_answer",
      description: "Explains why the user's answer to a multiple-choice question was incorrect.",
      parameters: {
        type: "object",
        properties: {
          explanation: {
            type: "string",
            description: "A plain text explanation (1-2 sentences) of why the user's answer is wrong.",
          },
        },
        required: ["explanation"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "start_exam_countdown",
      description: "Starts or resets the exam countdown timer to the provided ISO date/time.",
      parameters: {
        type: "object",
        properties: {
          targetTime: {
            type: "string",
            description: "ISO 8601 date/time for when the exam begins (e.g., 2025-12-06T15:30).",
          },
        },
        required: ["targetTime"],
      },
    },
  },
];

export function getToolCalls() {
  return baseToolCalls;
}

export type { ToolArray };
