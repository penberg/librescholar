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
    const prompt = `Please generate a serch query for Google Scholar to find relevant papers for the following research question: "${question}". The output must be a valid Google Scholar search query, but nothing more. Make the query relaxed without quotation marks.`;
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
    let organicResults = response.organic_results || [];
    let results: any[] = [];
    for (const result of organicResults) {
      if (!result.publication_info) {
        continue;
      }
      const rawAuthors = result.publication_info.authors || [];
      const authors = rawAuthors.map((author: any) => {
        return author.name;
      });
      const title = result.title;
      const url = result.link;
      const numCitations = result.inline_links?.cited_by?.total || 0;
      results.push({
        authors,
        title,
        url,
        numCitations
      });
    }
    results.sort((a, b) => b.numCitations - a.numCitations);
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
    <b>Research Question:</b>
    <div id="search-box">
      <form action="/">
        <div id="search-box">
          <textarea style={{width: "100%"}} placeholder="Enter a research question" name="question" defaultValue={question} />
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
            {result.authors.length > 0 ? result.authors.join(", ") + "." : "" } <a href={result.url}>{result.title}</a>. ({result.numCitations} citations)
          </li>
        ))
      }
      </ul>
    </div>
    </div>
  )
}
