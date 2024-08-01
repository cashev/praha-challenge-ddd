import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

async function getData(idToken: string = '') {
  const res = await fetch('http://localhost:3000/team', {
    headers: {
      method: 'GET',
      'Authorization': `Bearer ${idToken}`
    }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default async function TeamPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const data = await getData(user?.idToken);
  return (
    <>
      <h1 className="">チーム一覧画面</h1>
      <div>
        <h2>取得結果</h2>
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </>
  );
}
