import UserView from '@/components/UserView';
import { MessageFormDto, messageFormDtoSchema } from '@/dto/messageDto';
import { useChatsQuery } from '@/services/chats';
import { useMessagesQuery, useSendMessageMutation } from '@/services/messages';
import { getUser } from '@/services/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Twemoji } from 'react-emoji-render';
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
      <header className='sticky top-0'>
        <Link to={'/'}>&lt; Go back</Link>
        <UserView user={getUser() ?? ''} />
      </header>
      <main className='max-w-xs flex flex-col justify-between'>
        {showLoading && <p>Загрузка...</p>}
        {chat && messages && (
          <>
            <h1>{chat.title}</h1>
            <ul className='max-h-96 h-96 overflow-y-auto flex flex-col-reverse'>
              {messages.map((message) => (
                <li key={message.id}>
                  <h3>{message.author}:</h3>
                  <Twemoji className='text-md' svg>
                    {message.content || ' '}
                  </Twemoji>
                </li>
              ))}
            </ul>
            {sendMessageMutation.isLoading && <div>Отправляем сообщение...</div>}
            <form onSubmit={onSubmit} className='sticky bottom-0'>
              <input
                type='text'
                placeholder={`Написать в ${chat.title}`}
                {...register('content')}
              />
              <input type='file' {...register('image')} accept='image/*' />
              <button type='submit' className='btn btn-primary'>
                Отправить
              </button>
            </form>
          </>
        )}
      </main>
    </>
  );
}
