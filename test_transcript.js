const { getSubtitles } = require('youtube-caption-extractor');
const { YoutubeTranscript } = require('youtube-transcript');

async function test(videoId) {
  console.log(`\n--- Testing ${videoId} ---`);
  
  // Strategy 1
  try {
    const subtitles = await getSubtitles({ videoID: videoId, lang: 'en' });
    console.log(`[youtube-caption-extractor] Found: ${subtitles.length}`);
  } catch (e) {
    console.log(`[youtube-caption-extractor] Error: ${e.message}`);
  }

  // Strategy 2
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    console.log(`[youtube-transcript] Found: ${transcript.length}`);
  } catch (e) {
    console.log(`[youtube-transcript] Error: ${e.message}`);
  }
}

async function runTests() {
  await test('dQw4w9WgXcQ'); // Rick Astley
  await test('Y8Tko2YC5hA'); // MKBHD
  await test('jNQXAC9IVRw'); // Me at the zoo (Oldest video, might have no captions)
}

runTests();
