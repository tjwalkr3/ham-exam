import { z } from 'zod';

export const QuestionSchema = z.object({
  id: z.string(),
  correct: z.number().int().min(0).max(3),
  refs: z.string(),
  question: z.string(),
  answers: z.array(z.string()).length(4),
});

export const QuestionsSchema = z.array(QuestionSchema);

export type Question = z.infer<typeof QuestionSchema>;
export type Questions = z.infer<typeof QuestionsSchema>;
