import { NextResponse } from 'next/server'
// import { YoutubeTranscript } from 'youtube-transcript'
import OpenAI from 'openai'

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
    const { url } = await req.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Helper to extract Video ID
    const extractVideoId = (url: string) => {
      const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[1].length === 11) ? match[1] : null;
    };

    const videoId = extractVideoId(url);
    console.log('Attempting to fetch transcript for Video ID:', videoId);

    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL. Please provide a standard link or video ID.' }, { status: 400 })
    }

    try {
      console.log('Fetching transcript for:', videoId);
      
      // Custom robust transcript fetcher
      const fetchTranscript = async (id: string) => {
        const videoPageResponse = await fetch(`https://www.youtube.com/watch?v=${id}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9'
          }
        });
        const videoPageHtml = await videoPageResponse.text();
        
        // Find caption tracks
        const splittedHtml = videoPageHtml.split('"captionTracks":[');
        if (splittedHtml.length < 2) return null;
        
        const captionTracksStr = splittedHtml[1].split(']')[0];
        const captionTracks = JSON.parse(`[${captionTracksStr}]`);
        
        const englishTrack = captionTracks.find((t: any) => t.languageCode === 'en' || t.languageCode === 'en-US' || t.isTranslatable);
        if (!englishTrack) return null;
        
        const transcriptResponse = await fetch(englishTrack.baseUrl);
        const transcriptXml = await transcriptResponse.text();
        
        // Simple XML tag stripper
        return transcriptXml.replace(/<[^>]*>/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'")
          .replace(/&#39;/g, "'")
          .replace(/\s+/g, ' ')
          .trim();
      };

      const transcript = await fetchTranscript(videoId);
      console.log('Transcript length:', transcript?.length || 0);

      if (!transcript || transcript.length < 50) {
        return NextResponse.json({ error: 'Could not find a transcript for this video. This might be due to disabled captions, age restrictions, or region locks on the video highlights.' }, { status: 400 })
      }

    // Summarize using OpenAI
    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini", // Use a cheaper model
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
      max_tokens: 1000,
    })

      const summary = response.choices[0].message.content

      return NextResponse.json({ summary })
    } catch (innerError: any) {
      console.error('Transcript Fetch Error:', innerError);
      return NextResponse.json({ 
        error: `Could not fetch transcript: ${innerError.message}. This might be due to disabled captions or region restrictions.` 
      }, { status: 400 })
    }
  } catch (error: any) {
    console.error('API Route Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 })
  }
}
