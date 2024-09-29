import OpenAI from 'openai';
import { getJson } from "serpapi";

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
}); 

export default async function Search({ question }: { question: string }) {
  const search = async (question: string): Promise<[string, any[]]> => {
    'use server'
    if (!question) {
      return ["", []];
    }
    const prompt = `Please generate a serch query for Google Scholar to find relevant papers for the following research question: "${question}". The output must be a valid Google Scholar search query, but nothing more.`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });
    const scholarQuery = completion.choices[0]?.message?.content!;
    const response = await getJson({
      engine: "google_scholar",
      api_key: process.env['SERPAPI_API_KEY'],
      q: scholarQuery!,
    });
    const results = response.organic_results.map((result: any) => {
      const rawAuthors = result.publication_info.authors || [];
      const authors = rawAuthors.map((author: any) => {
        return author.name;
      });
      const title = result.title;
      const url = result.link;
      const numCitations = result.inline_links.cited_by?.total || 0;
      return {
        authors,
        title,
        url,
        numCitations
      };
    });
    return [scholarQuery, results];
  }
  const [scholarQuery, results] = await search(question);
  var searchTerms = null;
  if (question) {
    searchTerms = (
      <p className="mb-6">
        <b>Google Scholar query:</b> {scholarQuery}
      </p>
    )
  }
  return (
    <div>
      <p><i>Please type a research question below to find a list of relevant publications:</i></p>
    <div id="search-box">
      <form action="/">
        <div id="search-box">
          <input style={{width: "100%"}} placeholder="Enter a research question" name="question" type="text" defaultValue={question} />
        </div>
        <div id="search-button">
          <button type="submit">Search</button>
        </div>
      </form>
      { searchTerms }
    </div>
    <div id="search-results">
      <ul className="list-disc list-inside mb-6">
      {
        results.map((result: any) => (
          <li className="mb-2" key={result.title}>
            {result.authors.length > 0 ? result.authors.join(", ") + "." : "" } <b>{result.title}</b>. [<a href={result.url}>PDF</a>] ({result.numCitations} citations)
          </li>
        ))
      }
      </ul>
    </div>
    </div>
  )
}
