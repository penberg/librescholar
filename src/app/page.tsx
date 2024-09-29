import Search from '@/components/search'
import './globals.css'

export default function Home({ params, searchParams }: { params: any, searchParams: any }) {
  const question = searchParams.question;
  return (
    <main>
      <button><a href="https://github.com/penberg/librescholar">Github</a></button>
      <div>
        <h1>Academic Paper Search</h1>
      </div>
      <p>Example: <a href="?question=What%20is%20the%20state%20of%20art%20in%20large%20language%20models">"What is the state of art in large language models?"</a></p>
      <Search question={question}></Search>
    </main>
  )
}
