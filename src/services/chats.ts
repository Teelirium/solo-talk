import { ChatFormDto, chatRecordDtoSchema } from '@/dto/chatDto';
import { wait } from '@/util/wait';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { v4 } from 'uuid';

const key = 'chats';

async function getChats() {
  await wait(200);
  const chats = chatRecordDtoSchema
    .default({})
    .parse(JSON.parse(localStorage.getItem(key) ?? '{}'));
  return chats;
}

export const chatsQueryKey = [key];
export const useChatsQuery = () =>
  useQuery({
    queryKey: chatsQueryKey,
    queryFn: getChats,
    // staleTime: 10 * 60 * 1000
  });

async function addChat(chat: ChatFormDto) {
  const chats = await getChats();
  const id = v4();
  chats[id] = { ...chat, id };
  localStorage.setItem(key, JSON.stringify(chats));
}

export const useAddChatMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addChat,

    async onSuccess() {
      await queryClient.invalidateQueries(chatsQueryKey);
      onSuccess && onSuccess();
    },
  });
};
