import { NextResponse } from 'next/server'
import { YoutubeTranscript } from 'youtube-transcript'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Extract video ID and fetch transcript
    const transcriptEntries = await YoutubeTranscript.fetchTranscript(url)
    const transcript = transcriptEntries.map(entry => entry.text).join(' ')

    // Summarize using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview", // Use a capable model
      messages: [
        {
          role: "system",
          content: "You are a professional assistant that provides concise, high-quality summaries of YouTube video transcripts. Use bullet points and clear headings."
        },
        {
          role: "user",
          content: `Please summarize the following YouTube video transcript:\n\n${transcript}`
        }
      ],
      temperature: 0.7,
    })

    const summary = response.choices[0].message.content

    return NextResponse.json({ summary })
  } catch (error: any) {
    console.error('Summarization error:', error)
    return NextResponse.json({ error: error.message || 'Failed to summarize video' }, { status: 500 })
  }
}
