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
      className={`group transition-colors px-1 ${highlight ? 'bg-primary' : ''}
    ${pulse ? 'pulse' : ''}`}
    >
      <h3
        className={`inline ${
          (getUser() ?? '') === message.author ? 'text-accent font-bold' : 'text-secondary'
        }`}
      >
        {message.author}
      </h3>
      <Twemoji svg className='text-md p-1 flex-1'>
        {message.content || <>&nbsp;</>}
      </Twemoji>
      <button
        onClick={onQuoteButtonClick}
        className='inline text-transparent right-0 group-hover:text-gray-400 group-active:text-gray-400 transition-colors'
      >
        {highlight ? 'Не цитировать' : 'Цитировать'}
      </button>
      {quotedMessage && (
        <blockquote className='block text-lime-400' onClick={onQuotedMessageClick}>
          &gt; "{quotedMessage.content}" - {quotedMessage.author}
        </blockquote>
      )}
      <img src={message.image} className='max-h-48 block' />
    </li>
  );
}
