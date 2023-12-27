import Search from '@/components/search'
import './globals.css'

export default function Home({ params, searchParams }: { params: any, searchParams: any }) {
  const question = searchParams.question;
  return (
    <main>
      <button><a href="https://github.com/penberg/librescholar">Github</a></button>
      <div id="logo">
        <h1>LibreScholar</h1>
      </div>
      <Search question={question}></Search>
    </main>
  )
}
