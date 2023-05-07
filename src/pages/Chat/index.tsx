import MessageView from '@/components/MessageView';
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
      <header className='fixed layout top-0 h-16 p-2 flex justify-between items-center'>
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
        <h2 className='w-1/4 flex justify-end overflow-hidden max-h-full text-ellipsis whitespace-nowrap'>
          <b>{getUser() ?? ''}</b>
        </h2>
      </header>
      <main className='absolute layout top-16 bottom-44 flex flex-col justify-end gap-4 p-2'>
        {showLoading && <p>Загрузка...</p>}
        {chat && messages && (
          <>
            <ul className='overflow-y-auto flex flex-col-reverse h-full'>
              {sendMessageMutation.isLoading && <li>Отправляем сообщение...</li>}
              {messages.map((message) => (
                <MessageView key={message.id} message={message} />
              ))}
            </ul>
          </>
        )}
      </main>
      <form onSubmit={onSubmit} className='fixed layout bottom-0 flex flex-col gap-2 h-44 p-2'>
        <input
          type='text'
          placeholder={`Написать в ${chat?.title}`}
          className='input input-bordered w-full max-h-24'
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
