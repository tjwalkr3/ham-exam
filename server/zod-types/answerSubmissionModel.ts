import { z } from "zod";

export const AnswerSubmissionSchema = z.object({
  questionId: z.number(),
  correct: z.boolean(),
});

export type AnswerSubmission = z.infer<typeof AnswerSubmissionSchema>;
