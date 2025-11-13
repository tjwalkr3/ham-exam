import { useQuery, useMutation } from '@tanstack/react-query';
import { QuestionsSchema, type Questions } from '../zod-types/questionModel';
import { SubsectionMasteriesSchema, type SubsectionMasteries } from '../zod-types/subsectionMasteryModel';
import { fetchWrapper } from '../utils/fetchWrapper';

async function fetchQuestions(subsectionCode: string, token: string): Promise<Questions> {
  const licenseClass = subsectionCode.charAt(0);
  const data = await fetchWrapper<unknown>(`/api/questions/${licenseClass}/${subsectionCode}`, { token });
  return QuestionsSchema.parse(data);
}

export function useQuizQuestions(subsectionCode: string, token: string) {
  return useQuery({
    queryKey: ['questions', subsectionCode],
    queryFn: () => fetchQuestions(subsectionCode, token),
    enabled: !!subsectionCode && !!token,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}

async function fetchSubsectionMasteries(licenseClass: string, token: string): Promise<SubsectionMasteries> {
  const data = await fetchWrapper<unknown>(`/api/masteries/${licenseClass}`, { token });
  return SubsectionMasteriesSchema.parse(data);
}

export function useSubsectionMasteries(licenseClass: string, token: string) {
  return useQuery({
    queryKey: ['masteries', licenseClass],
    queryFn: () => fetchSubsectionMasteries(licenseClass, token),
    enabled: !!licenseClass && !!token,
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
