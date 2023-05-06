type Props = {
  user: string;
};

export default function UserView({ user }: Props) {
  return (
    <h2>
      <b>{user}</b>
    </h2>
  );
}
