import { MessageDto } from '@/dto/messageDto';
import { getUser } from '@/services/user';
import { Twemoji } from 'react-emoji-render';

type Props = {
  message: MessageDto;
};

export default function MessageView({ message }: Props) {
  return (
    <li>
      <h3
        className={`inline p-1 ${
          (getUser() ?? '') === message.author ? 'text-accent font-bold' : 'text-secondary'
        }`}
      >
        {message.author}
      </h3>
      <Twemoji className='text-md p-1' svg>
        {message.content || <>&nbsp;</>}
      </Twemoji>
      <img src={message.image} className='max-h-48 block' />
    </li>
  );
}
