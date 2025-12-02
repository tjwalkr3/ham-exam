import { fetchWrapper } from '../../utils/fetchWrapper';
import { getToolCalls } from '../../tooling/toolCalls';
import { ChatResponseSchema } from '../../zod-types/chatResponseModel';
import type { Question } from '../../zod-types/questionModel';

export function constructAiMessages(question: Question, selectedAnswerIndex: number) {
  return [
    {
      role: "system" as const,
      content: "You are a helpful assistant for a ham radio exam app. You will be given a question, answer choices, and the user's selected answer. If the user's answer is incorrect, call the 'explain_question_answer' tool with a 1-2 sentence plain text explanation of why it is wrong. If the answer is correct, do nothing."
    },
    {
      role: "user" as const,
      content: `Question: ${question.question}
Answers: ${question.answers.map((a, i) => `${String.fromCharCode(65 + i)}. ${a}`).join('\n')}
User Answer: ${String.fromCharCode(65 + selectedAnswerIndex)}. ${question.answers[selectedAnswerIndex]}
Correct Answer: ${String.fromCharCode(65 + question.correct)}. ${question.answers[question.correct]}`
    }
  ];
}

export async function getAiExplanation(token: string, question: Question, selectedAnswerIndex: number): Promise<string | null> {
  const messages = constructAiMessages(question, selectedAnswerIndex);

  const data = await fetchWrapper<unknown>("/api/ai/messages", {
    method: "POST",
    body: JSON.stringify({
      messages,
      tools: getToolCalls(),
    }),
    token,
  });

  const response = ChatResponseSchema.parse(data);
  
  if (response.toolCalls) {
    for (const toolCall of response.toolCalls) {
      if (toolCall.function.name === 'explain_question_answer') {
        const args = JSON.parse(toolCall.function.arguments);
        if (args.explanation) {
          return args.explanation;
        }
      }
    }
  }
  return null;
}
