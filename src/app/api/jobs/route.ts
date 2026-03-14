import { NextResponse } from 'next/server'
import FirecrawlApp from '@mendable/firecrawl-js'
import OpenAI from 'openai'

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRE_CRAWL_API_KEY,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
      scrapeOptions: {
        formats: ['markdown'],
      }
    }) as any

    if (!searchResults.success) {
      throw new Error('Firecrawl search failed')
    }

    // Process results with AI to extract structured job data
    const jobsData = await Promise.all(searchResults.data.map(async (result: any) => {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Extract structured job information from the following text. Return a JSON object with title, company, location, salary (if available), and a brief 2-sentence description."
          },
          {
            role: "user",
            content: result.markdown || result.content || ""
          }
        ],
        response_format: { type: "json_object" }
      })
      
      return JSON.parse(response.choices[0].message.content!)
    }))

    return NextResponse.json({ jobs: jobsData })
  } catch (error: any) {
    console.error('Job search error:', error)
    return NextResponse.json({ error: error.message || 'Failed to search jobs' }, { status: 500 })
  }
}
