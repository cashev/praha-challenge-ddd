async function getData() {
  const res = await fetch('http://localhost:3000/team')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default async function TeamPage() {
  const data = await getData();
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
