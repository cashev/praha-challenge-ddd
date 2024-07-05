import SignIn from "../../components/sign-in";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="mt-8 text-center">ログイン画面</h1>
      <SignIn />
    </div>
  );
}
