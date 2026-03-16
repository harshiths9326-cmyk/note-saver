import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript-plus';
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
    
    // Primary Strategy: youtube-transcript-plus (Currently most reliable)
    try {
      console.log(`Fetching transcript using youtube-transcript-plus for: ${videoId}`);
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      if (transcript && transcript.length > 0) {
        transcriptText = transcript.map(t => t.text).join(' ');
      }
    } catch (e: unknown) {
      console.error('Transcript fetch failed:', e);
      const errorMsg = e instanceof Error ? e.message : 'Unknown error';
      
      // If it's a known "no transcript" error, provide a specific message
      if (errorMsg.includes('transcript is disabled') || errorMsg.includes('No transcript found')) {
          return NextResponse.json({ 
            error: 'Transcripts are disabled for this video. Please try a video that has closed captions (CC) enabled.' 
          }, { status: 404 });
      }
    }

    if (!transcriptText) {
      return NextResponse.json({ 
        error: 'Could not extract transcript. This video might be age-restricted, private, or have transcripts disabled by the creator.' 
      }, { status: 404 });
    }

    console.log(`Generating ${mode} summary using Gemini (${transcriptText.length} chars)...`);
    const summary = await generateSummary(transcriptText, mode);

    return NextResponse.json({ summary });

  } catch (error: unknown) {
    console.error('Summarization error:', error);
    const message = error instanceof Error ? error.message : 'Failed to summarize'
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
