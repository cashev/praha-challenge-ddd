async function getData() {
  const res = await fetch('http://localhost:3000/team')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default async function TeamPage() {
  const data = await getData();
  return <main>{JSON.stringify(data)}</main>
}
