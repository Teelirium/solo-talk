import { z } from 'zod';

export const chatDtoSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
});
export type ChatDto = z.infer<typeof chatDtoSchema>;

export const chatFormDtoSchema = z.object({
  title: z.string(),
});
export type ChatFormDto = z.infer<typeof chatFormDtoSchema>;

export const chatRecordDtoSchema = z.record(chatDtoSchema);
export type ChatRecordDto = z.infer<typeof chatRecordDtoSchema>;
