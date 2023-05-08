import { ChatDto, ChatFormDto, chatRecordDtoSchema } from '@/dto/chatDto';
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
  const newChat = { ...chat, id } satisfies ChatDto;
  chats[id] = newChat;
  localStorage.setItem(key, JSON.stringify(chats));
  return newChat;
}

export const useAddChatMutation = (onSuccess?: (newChat: ChatDto) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addChat,

    async onSuccess(chat: ChatDto) {
      await queryClient.invalidateQueries(chatsQueryKey);
      onSuccess && onSuccess(chat);
    },
  });
};
