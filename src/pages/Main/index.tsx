import { ChatFormDto, chatFormDtoSchema } from '@/dto/chatDto';
import { useAddChatMutation, useChatsQuery } from '@/services/chats';
import { getUser } from '@/services/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export default function Main() {
  const { data: chats, ...chatsQuery } = useChatsQuery();

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
      <header className='relative layout h-16 bg-[color:var(--bg-color)] p-2 flex justify-between items-center'>
        <h1 className='w-2/3 font-bold'>Talk 2 Real Ones</h1>
        <h2 className='w-1/3 flex justify-end overflow-hidden max-h-full text-ellipsis whitespace-nowrap'>
          {getUser() ?? ''}
        </h2>
      </header>
      <main className='relative layout p-4 flex flex-col overflow-hidden'>
        <ul className='flex flex-col gap-4 h-screen'>
          {chatsQuery.isLoading && <li>Загрузка...</li>}
          {Object.entries(chats ?? {}).map(([id, chat]) => (
            <li key={id} className='link text-xl '>
              <Link to={`chat/${id}`}>
                <h3>{chat.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
        <form onSubmit={onSubmit} className='p-2 flex flex-col gap-2'>
          <input
            type='text'
            placeholder='Название чата'
            className='input input-bordered w-full'
            {...register('title')}
          />
          <button type='submit' className='btn self-end'>
            Создать новый чат
          </button>
        </form>
      </main>
    </>
  );
}
