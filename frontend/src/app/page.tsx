import SignOut from "@/components/sign-out";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="mt-8 text-center">Firebase Auth with Next.js</h1>
      <div className="mb-8 text-center">
        {user ?
          (
            <>
              <div>ログイン中: {user.email}</div>
              <SignOut />
            </>
          ) : (
            <>
              <nav>
                <ul>
                  <li>
                    <Link href="/signin">ログイン</Link>
                  </li>
                  <li>
                    <Link href="/signup">新規登録</Link>
                  </li>
                </ul>
              </nav>
            </>
          )}
      </div>
      <nav>
        <ul>
          <li>
            <Link href="/team">チーム一覧</Link>
          </li>
          <li>
            <Link href="/pair">ペア一覧</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
