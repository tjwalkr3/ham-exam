import { useQuery } from '@tanstack/react-query';
import { QuestionsSchema, type Questions } from '../zod-types/questionModel';
import { fetchWrapper } from '../utils/fetchWrapper';

async function fetchQuestions(licenseClass: string, username: string): Promise<Questions> {
  const data = await fetchWrapper<unknown>(`/api/questions/${licenseClass}/${username}`);
  return QuestionsSchema.parse(data);
}

export function useQuizQuestions(licenseClass: string, username: string) {
  return useQuery({
    queryKey: ['questions', licenseClass, username],
    queryFn: () => fetchQuestions(licenseClass, username),
    enabled: !!licenseClass && !!username,
  });
}
