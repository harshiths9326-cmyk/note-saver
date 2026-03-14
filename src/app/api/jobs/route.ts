import { NextResponse } from 'next/server'
import FirecrawlApp from '@mendable/firecrawl-js'
import OpenAI from 'openai'

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRE_CRAWL_API_KEY,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_KEY?.startsWith('sk-or-') 
    ? 'https://openrouter.ai/api/v1' 
    : undefined,
  defaultHeaders: process.env.OPENAI_API_KEY?.startsWith('sk-or-')
    ? {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "NoteSaver AI",
      }
    : undefined,
})

export async function POST(req: Request) {
  try {
    const { query, location } = await req.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // Use Firecrawl to search and extract job listings
    // Note: Firecrawl's crawl or scrape can be used depending on the goal.
    // For a broad search, we might use search or map, but here we'll use crawl with a prompt for extraction.
    const searchResults = await firecrawl.search(`${query} jobs in ${location || 'remote'}`, {
      limit: 5,
    }) as any

    // If it's a "success: false" but has data, we treat it as success (Firecrawl SDK edge case)
    if (!searchResults.success && (!searchResults.data || searchResults.data.length === 0)) {
      console.error('Full Firecrawl Response:', JSON.stringify(searchResults, null, 2));
      throw new Error(`Firecrawl search failed: ${searchResults.error || searchResults.message || 'Unknown error'}`)
    }

    const dataToProcess = searchResults.data || [];

    // Process results with AI to extract structured job data
    const jobsData = await Promise.all(dataToProcess.map(async (result: any) => {
      const response = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini", // Use a cheaper model for structured data
        messages: [
          {
            role: "system",
            content: "Extract structured job information from the following text. Return a JSON object with title, company, location, salary (if available), and a brief 2-sentence description."
          },
          {
            role: "user",
            content: `URL: ${result.url}\nTitle: ${result.title}\nDescription: ${result.description}\nContent: ${result.markdown || result.content || "N/A"}`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
      })
      
      return JSON.parse(response.choices[0].message.content!)
    }))

    return NextResponse.json({ jobs: jobsData })
  } catch (error: any) {
    console.error('Job search error:', error)
    return NextResponse.json({ error: error.message || 'Failed to search jobs' }, { status: 500 })
  }
}
