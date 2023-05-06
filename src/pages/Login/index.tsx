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
    <main>
      <h1>Введите имя пользователя</h1>
      <form onSubmit={onSubmit}>
        <input type='text' {...register('username')} />
        <button type='submit'>Войти</button>
      </form>
    </main>
  );
}
