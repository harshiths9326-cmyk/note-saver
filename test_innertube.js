const { Innertube } = require('youtubei.js');

async function test(videoId) {
  try {
    console.log(`\n--- Testing ${videoId} with youtubei.js ---`);
    const youtube = await Innertube.create();
    const info = await youtube.getInfo(videoId);
    const transcript_data = await info.getTranscript();
    
    if (transcript_data && transcript_data.transcript && transcript_data.transcript.content && transcript_data.transcript.content.body && transcript_data.transcript.content.body.initial_segments) {
        const segments = transcript_data.transcript.content.body.initial_segments;
        console.log(`Found ${segments.length} segments.`);
        const text = segments.map(s => s.snippet.text).join(' ');
        console.log(`Snippet: ${text.substring(0, 100)}...`);
    } else {
        console.log('No transcript segments found in the response.');
    }
  } catch (e) {
    console.error(`Error: ${e.message}`);
    // If getTranscript() itself fails, it might mean no captions available
  }
}

async function run() {
    await test('dQw4w9WgXcQ');
}

run();
