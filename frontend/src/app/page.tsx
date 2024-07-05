'use client';

import { useUser } from "../contexts/user-context";
import SignOut from "@/components/sign-out";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();

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
              <ul>
                <li>
                  <Link href="/team">チーム一覧</Link>
                </li>
                <li>
                  <Link href="/pair">ペア一覧</Link>
                </li>
              </ul>
            </nav>
          </>
        )}
      </div>
    </div>
  );
}
