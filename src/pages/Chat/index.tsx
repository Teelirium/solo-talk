import MessageView from '@/components/MessageView';
import { MessageFormDto, messageFormDtoSchema } from '@/dto/messageDto';
import { useChatsQuery } from '@/services/chats';
import { useMessagesQuery, useSendMessageMutation } from '@/services/messages';
import { getUser } from '@/services/user';
import { wait } from '@/util/wait';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useParams } from 'react-router-dom';
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

async function scrollToMessage(messageId: string) {
  window.location.hash = '';
  await wait(100);
  window.location.hash = `#${messageId}`;
}

export default function Chat() {
  const scrollContainer = useRef<HTMLUListElement>(null);
  const { hash } = useLocation();
  const { chatId } = paramSchema.parse(useParams());

  const { data: messages, ...messagesQuery } = useMessagesQuery(chatId);
  const messageMap = useMemo(() => {
    return new Map(messages?.map((m) => [m.id, m]));
  }, [messages]);

  const { data: chats, ...chatsQuery } = useChatsQuery();
  const chat = chats ? chats[chatId] : undefined;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm<MessageFormDto>({
    resolver: zodResolver(messageFormDtoSchema),
  });
  const quotedMessageId = watch('quotedMessage');
  const quotedMessage = messageMap.get(quotedMessageId ?? '');

  const { mutate, ...sendMessageMutation } = useSendMessageMutation(() => {
    reset();
  });

  const onSubmit = handleSubmit(async (data) => {
    let image: string | undefined = undefined;
    if (data.image.length > 0) {
      image = await toBase64(data.image[0]);
    }
    if (!data.content && !image) {
      return;
    }
    mutate({
      chatId,
      content: data.content ?? '',
      image,
      author: getUser() ?? '',
      quotedMessage: data.quotedMessage,
    });
    scrollContainer.current?.scrollTo(0, 0);
  });

  const onQuoteClick = (msgId: string) => {
    if (quotedMessageId === msgId) {
      return setValue('quotedMessage', undefined);
    }
    setValue('quotedMessage', msgId);
  };

  const showLoading = messagesQuery.isLoading || chatsQuery.isLoading;

  return (
    <>
      <header className='relative layout h-24 p-4 bg-[color:var(--bg-color)] flex justify-between items-center z-10'>
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
        <h1 className='w-1/2 flex justify-center'>{chat?.title ?? ''}</h1>
        <h2 className='w-1/4 flex justify-end overflow-hidden max-h-full text-ellipsis whitespace-nowrap'>
          {getUser() ?? ''}
        </h2>
      </header>
      <main className='relative layout p-2 flex flex-col overflow-hidden'>
        <ul
          className='flex flex-col-reverse overflow-y-auto h-screen p-2 py-0'
          ref={scrollContainer}
        >
          {showLoading && <li>Загрузка...</li>}
          {sendMessageMutation.isLoading && <li>Отправляем сообщение...</li>}
          {chat &&
            messages &&
            messages.map((message) => (
              <MessageView
                key={message.id}
                message={message}
                quotedMessage={messageMap.get(message.quotedMessage ?? '')}
                highlight={message.id === quotedMessageId}
                pulse={hash.endsWith(message.id)}
                onQuoteButtonClick={() => onQuoteClick(message.id)}
                onQuotedMessageClick={() => scrollToMessage(message.quotedMessage ?? '')}
              />
            ))}
        </ul>
        {[errors.content?.message, errors.image?.message, errors.quotedMessage?.message].join(' ')}
        <form onSubmit={onSubmit} className='flex flex-wrap justify-end gap-2 p-2'>
          <input type='text' {...register('quotedMessage')} className='hidden' />
          <div className='form-control w-full'>
            <label className='label py-1' onClick={() => scrollToMessage(quotedMessageId ?? '')}>
              {quotedMessage && <span className='label-text'>&gt; {quotedMessage.content}</span>}
            </label>
            <input
              type='text'
              placeholder={`Написать в ${chat?.title ?? ''}`}
              className='input input-bordered w-full shrink-0'
              {...register('content')}
            />
          </div>
          <input
            type='file'
            {...register('image')}
            accept='image/*'
            className='file-input shrink-0 w-full'
          />
          <button type='submit' className='btn btn-primary'>
            Отправить
          </button>
        </form>
      </main>
    </>
  );
}
