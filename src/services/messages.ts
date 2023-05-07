import { MessageDto, messageDtoSchema } from '@/dto/messageDto';
import { wait } from '@/util/wait';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { v4 } from 'uuid';

const getKey = (id: string) => `chat-${id}`;

async function getMessages(chatId: string) {
  await wait(200);
  const messages = messageDtoSchema
    .array()
    .parse(JSON.parse(localStorage.getItem(getKey(chatId)) ?? '[]'));
  return messages;
}

export const messagesQueryKey = (chatId: string) => ['messages', chatId];
export const useMessagesQuery = (chatId: string) =>
  useQuery({
    queryKey: messagesQueryKey(chatId),
    queryFn: () => getMessages(chatId),
    // staleTime: 60 * 1000,
  });

async function sendMessage({
  chatId,
  author,
  content,
  image,
  quotedMessage,
}: {
  chatId: string;
  author: string;
  content: string;
  image?: string;
  quotedMessage?: string;
}) {
  await wait(300);
  const messages = await getMessages(chatId);
  const newMessage = {
    id: v4(),
    content,
    author,
    image,
    quotedMessage,
  };
  messages.unshift(newMessage);
  localStorage.setItem(getKey(chatId), JSON.stringify(messages));
  return newMessage;
}

export const useSendMessageMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,

    async onMutate(vars) {
      await queryClient.cancelQueries({ queryKey: messagesQueryKey(vars.chatId) });
    },

    async onSuccess(result, vars) {
      queryClient.setQueryData<MessageDto[]>(messagesQueryKey(vars.chatId), (old) => {
        if (old) {
          old.unshift(result);
        }
        return old;
      });
      onSuccess && onSuccess();
    },

    async onSettled(_, __, vars) {
      // await queryClient.invalidateQueries(messagesQueryKey(vars.chatId));
    },
  });
};
