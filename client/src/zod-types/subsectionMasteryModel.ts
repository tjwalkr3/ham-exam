import { z } from "zod";

export const SubsectionMasterySchema = z.object({
  code: z.string(),
  totalMastery: z.number(),
  lastStudied: z.number().nullable(),
});

export const SubsectionMasteriesSchema = z.array(SubsectionMasterySchema);

export type SubsectionMastery = z.infer<typeof SubsectionMasterySchema>;
export type SubsectionMasteries = z.infer<typeof SubsectionMasteriesSchema>;
