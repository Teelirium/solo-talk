import { MessageDto } from '@/dto/messageDto';
import { getUser } from '@/services/user';
import { Twemoji } from 'react-emoji-render';
import './styles.css';

type Props = {
  message: MessageDto;
  quotedMessage?: MessageDto;
  highlight?: boolean;
  pulse?: boolean;
  onQuoteButtonClick?: () => void;
  onQuotedMessageClick?: () => void;
};

export default function MessageView({
  message,
  quotedMessage,
  onQuoteButtonClick,
  onQuotedMessageClick,
  highlight = false,
  pulse = false,
}: Props) {
  return (
    <li
      id={message.id}
      className={`group px-1 text-lg break-words transition-colors bg-opacity-40 ${
        highlight ? 'bg-blue-400' : ''
      } ${pulse ? 'pulse' : ''}`}
    >
      {quotedMessage && (
        <blockquote
          className='block text-green-500 dark:text-green-400'
          onClick={onQuotedMessageClick}
        >
          &gt;{quotedMessage.author}: "{quotedMessage.content}"
        </blockquote>
      )}
      <h3
        className={`inline ${
          (getUser() ?? '') === message.author ? 'text-accent font-bold' : 'text-secondary'
        }`}
      >
        {message.author}
      </h3>
      <span onClick={onQuoteButtonClick}>
        <Twemoji svg className='text-md p-1 flex-1'>
          {message.content || <>&nbsp;</>}
        </Twemoji>
      </span>
      <button
        onClick={onQuoteButtonClick}
        className='inline opacity-70 text-transparent right-0 group-hover:text-[color:var(--txt-color)] group-active:text-[color:var(--txt-color)] transition-colors'
      >
        {highlight ? 'Отменить цитирование' : 'Цитировать'}
      </button>
      <img src={message.image} className='max-h-48 block' />
    </li>
  );
}
