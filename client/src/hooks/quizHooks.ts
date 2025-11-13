import { useQuery, useMutation } from '@tanstack/react-query';
import { QuestionsSchema, type Questions } from '../zod-types/questionModel';
import { fetchWrapper } from '../utils/fetchWrapper';

async function fetchQuestions(licenseClass: string, token: string): Promise<Questions> {
  const data = await fetchWrapper<unknown>(`/api/questions/${licenseClass}`, { token });
  return QuestionsSchema.parse(data);
}

export function useQuizQuestions(licenseClass: string, token: string) {
  return useQuery({
    queryKey: ['questions', licenseClass],
    queryFn: () => fetchQuestions(licenseClass, token),
    enabled: !!licenseClass && !!token,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}

async function submitAnswer(questionId: string, correct: boolean, token: string): Promise<void> {
  await fetchWrapper('/api/answer', {
    method: 'POST',
    body: JSON.stringify({ questionId, correct }),
    token,
  });
}

export function useSubmitAnswer(token: string) {
  return useMutation({
    mutationFn: ({ questionId, correct }: { questionId: string; correct: boolean }) =>
      submitAnswer(questionId, correct, token),
  });
}
