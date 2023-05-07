import { z } from 'zod';

export const messageDtoSchema = z.object({
  id: z.string().uuid(),
  image: z.string().url().optional(),
  content: z.string(),
  author: z.string(),
  quotedMessage: z.string().uuid().optional(),
});
export type MessageDto = z.infer<typeof messageDtoSchema>;

export const messageFormDtoSchema = z.object({
  image: z.instanceof(FileList),
  content: z.string().optional(),
  quotedMessage: z.string().uuid().optional().catch(undefined),
});
export type MessageFormDto = z.infer<typeof messageFormDtoSchema>;
