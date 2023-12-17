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
      <button className="border-black border rounded-lg font-semibold py-1 px-4  ml-4 bg-black text-white"><a href="https://github.com/penberg/librescholar">Github</a></button>
      </div>
      <form className="flex w-full max-w-xl items-center space-x-2 mb-8 justify-center" action="/">
        <input className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter a research question" name="question" type="text" defaultValue={question} />
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
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
