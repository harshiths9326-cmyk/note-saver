import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { extractVideoId } from '@/lib/youtube';
import { generateSummary, SummaryMode } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { url, mode = 'short' } = await req.json() as { url: string; mode: SummaryMode };

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    let transcriptText = '';
    try {
      console.log(`Fetching transcript for video: ${videoId}`);
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      transcriptText = transcript.map((t: { text: string }) => t.text).join(' ');
    } catch (error: unknown) {
      console.error('Transcript fetch error:', error);
      return NextResponse.json({ 
        error: 'Could not find a transcript for this video. This might be due to disabled captions, age restrictions, or region locks.' 
      }, { status: 404 });
    }

    if (!transcriptText) {
      return NextResponse.json({ error: 'Transcript is empty' }, { status: 404 });
    }

    console.log(`Generating ${mode} summary using Gemini...`);
    const summary = await generateSummary(transcriptText, mode);

    return NextResponse.json({ summary });

  } catch (error: unknown) {
    console.error('Summarization error:', error);
    const message = error instanceof Error ? error.message : 'Failed to summarize'
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
