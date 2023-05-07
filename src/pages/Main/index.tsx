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
      <header className='fixed layout top-0 h-16 p-2 flex justify-between items-center'>
        <h1 className='w-2/3 font-bold'>Talk 2 Real Ones</h1>
        <h2 className='w-1/3 flex justify-end overflow-hidden max-h-full text-ellipsis whitespace-nowrap'>
          {getUser() ?? ''}
        </h2>
      </header>
      <main className='absolute layout top-16 bottom-32 p-4'>
        <ul className='flex flex-col gap-4'>
          {Object.entries(chats ?? {}).map(([id, chat]) => (
            <li key={id} className='link text-xl'>
              <Link to={`chat/${id}`}>
                <h3>{chat.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <form onSubmit={onSubmit} className='fixed layout bottom-0 p-2 h-32 flex flex-col gap-2'>
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
    </>
  );
}
