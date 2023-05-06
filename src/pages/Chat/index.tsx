import MessageView from '@/components/MessageView';
import UserView from '@/components/UserView';
import { MessageFormDto, messageFormDtoSchema } from '@/dto/messageDto';
import { useChatsQuery } from '@/services/chats';
import { useMessagesQuery, useSendMessageMutation } from '@/services/messages';
import { getUser } from '@/services/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { z } from 'zod';

const paramSchema = z.object({
  chatId: z.string().uuid(),
});

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (reader.result === null) {
        return reject('Failed to convert file');
      }
      return resolve(reader.result.toString());
    };
  });

export default function Chat() {
  const scroll = useRef(null);
  const { chatId } = paramSchema.parse(useParams());

  const { data: messages, ...messagesQuery } = useMessagesQuery(chatId);

  const { data: chats, ...chatsQuery } = useChatsQuery();
  const chat = chats ? chats[chatId] : undefined;

  const { register, handleSubmit, reset } = useForm<MessageFormDto>({
    resolver: zodResolver(messageFormDtoSchema),
  });

  const { mutate, ...sendMessageMutation } = useSendMessageMutation(() => {
    reset();
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!data.content) {
      return;
    }

    let image: string | undefined = undefined;
    if (data.image.length > 0) {
      image = await toBase64(data.image[0]);
    }

    mutate({ chatId, content: data.content, image, author: getUser() ?? '' });
  });

  const showLoading = messagesQuery.isFetching || chatsQuery.isFetching;

  return (
    <>
      <header className='sticky top-0 p-2 flex justify-between items-center h-16'>
        <Link to={'/'} className='w-1/4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className='w-8 h-8 inline'
          >
            <path
              fillRule='evenodd'
              d='M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z'
              clipRule='evenodd'
            />
          </svg>
        </Link>
        <h1 className='w-1/2 flex justify-center'>{chat?.title}</h1>
        <span className='w-1/4 flex justify-start overflow-hidden max-h-full text-ellipsis whitespace-nowrap'>
          <UserView user={getUser() ?? ''} />
        </span>
      </header>
      <main className='flex flex-col justify-around gap-4'>
        {showLoading && <p>Загрузка...</p>}
        {chat && messages && (
          <>
            <ul className='max-h-full overflow-y-auto flex flex-col-reverse'>
              {messages.map((message) => (
                <MessageView key={message.id} message={message} />
              ))}
            </ul>
            {sendMessageMutation.isLoading && <div>Отправляем сообщение...</div>}
          </>
        )}
      </main>
      <form onSubmit={onSubmit} className='fixed w-full bottom-0 self-center flex flex-col gap-2'>
        <input
          type='text'
          placeholder={`Написать в ${chat?.title}`}
          className='input w-full max-h-24 resize-vertical'
          {...register('content')}
        />
        <input type='file' {...register('image')} accept='image/*' className='file-input' />
        <button type='submit' className='btn btn-primary self-end'>
          Отправить
        </button>
      </form>
    </>
  );
}
