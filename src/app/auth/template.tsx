type Props = {
  children: React.ReactNode;
};

export default function AuthTemplate(props: Props) {
  return (
    <div className="min-h-svh w-screen flex bg-muted justify-center items-center">
      {props.children}
    </div>
  );
}
