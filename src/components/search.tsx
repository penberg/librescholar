import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import OpenAI from 'openai';
import { search as searchGoogleScholar } from "scholarly";

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
}); 

export default async function Search({ question }: { question: string }) {
  const search = async (question: string): Promise<[string, any[]]> => {
    'use server'
    if (!question) {
      return ["", []];
    }
    const prompt = `Please generate a list of keywords to use on Google Scholar to find relevant papers for the following research question: "${question}" The output must be a list of words, separated by spaces, but nothing more.`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    const keywords = completion.choices[0]?.message?.content!;
    const results = await searchGoogleScholar(keywords!);
    return [keywords, results];
  }
  const [keywords, results] = await search(question);
  var searchTerms = null;
  if (question) {
    searchTerms = (
      <p className="mb-6">
        <b>Search terms:</b> {keywords}
      </p>
    )
  }
  return (
    <div className="container mx-auto px-4 py-6 flex flex-col">
      <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-center mx-auto">LibreScholar</h1>
      <Button className="border-black border rounded-lg font-semibold py-1 px-4  ml-4 bg-black text-white"><a href="https://github.com/penberg/librescholar">Github</a></Button>
      </div>
      <form className="flex w-full max-w-xl items-center space-x-2 mb-8 justify-center" action="/">
        <Input className="w-full" placeholder="Enter a research question" name="question" type="text" defaultValue={question} />
        <Button type="submit">Search</Button>
      </form>
      { searchTerms }
      <ul className="list-disc list-inside mb-6">
      {
        results.map((result: any) => (
          <li className="mb-2" key={result.title}>
            <b><a href={result.url}>{result.title}</a></b> {result.year} ({result.numCitations} citations)
          </li>
        ))
      }
      </ul>
      <div className="grid grid-cols-1 gap-6 justify-items-center" />
    </div>
  )
}
