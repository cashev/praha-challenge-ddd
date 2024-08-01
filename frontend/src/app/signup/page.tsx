import SignUp from "../../components/sign-up";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="mt-8 text-center">新規登録画面</h1>
      <SignUp />
    </div>
  );
}
