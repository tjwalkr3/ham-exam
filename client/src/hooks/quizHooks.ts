import { useQuery } from '@tanstack/react-query';
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
  });
}
