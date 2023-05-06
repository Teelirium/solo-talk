import UserView from '@/components/UserView';
import { ChatFormDto, chatFormDtoSchema } from '@/dto/chatDto';
import { useAddChatMutation, useChatsQuery } from '@/services/chats';
import { getUser } from '@/services/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export default function Main() {
  const { data: chats } = useChatsQuery();

  const { register, handleSubmit, reset } = useForm<ChatFormDto>({
    resolver: zodResolver(chatFormDtoSchema),
  });

  const addChatMutation = useAddChatMutation(() => {
    reset();
  });

  const onSubmit = handleSubmit((data) => {
    addChatMutation.mutate(data);
  });

  return (
    <>
      <header>
        <h1>Talk 2 Real Ones</h1>
        <UserView user={getUser() ?? ''} />
      </header>
      <main>
        <ul>
          {Object.entries(chats ?? {}).map(([id, chat]) => (
            <li key={id}>
              <Link to={`chat/${id}`}>
                <h3>{chat.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
        <form onSubmit={onSubmit}>
          <input type='text' {...register('title')} placeholder='Название чата' />
          <button type='submit'>Создать новый чат</button>
        </form>
      </main>
    </>
  );
}
