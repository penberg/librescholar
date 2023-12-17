import Search from '@/components/search'

export default function Home({ params, searchParams }: { params: any, searchParams: any }) {
  const question = searchParams.question;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Search question={question}></Search>
    </main>
  )
}
