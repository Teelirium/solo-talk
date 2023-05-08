import { getUser, setUser } from '@/services/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const userDtoSchema = z.object({ username: z.string() });

export default function Login() {
  const { register, handleSubmit } = useForm<z.infer<typeof userDtoSchema>>({
    resolver: zodResolver(userDtoSchema),
  });
  const nav = useNavigate();

  const user = getUser();

  if (user !== null) {
    return <Navigate to={'/'} replace />;
  }

  const onSubmit = handleSubmit((data) => {
    setUser(data.username);
    nav('/', { replace: true });
  });

  return (
    <>
      <main className='relative layout flex flex-col p-4 gap-2 justify-center'>
        <h1>Введите имя пользователя</h1>
        <form onSubmit={onSubmit} className='flex flex-col gap-2'>
          <input type='text' placeholder='...' {...register('username')} className='input' />
          <button type='submit' className='btn btn-primary'>
            Войти
          </button>
        </form>
      </main>
      <span className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <img className='animate-bounce' src={'/kotohime-pet.gif'} />
      </span>
    </>
  );
}
