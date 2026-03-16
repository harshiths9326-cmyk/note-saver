const { YoutubeTranscript } = require('youtube-transcript-plus');

async function test(videoId) {
  try {
    console.log(`Testing ${videoId}...`);
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    console.log(`Found ${transcript.length} segments.`);
  } catch (e) {
    console.error(`Error for ${videoId}: ${e.message}`);
  }
}

async function runTests() {
  await test('dQw4w9WgXcQ'); // Rick Astley
  await test('Y8Tko2YC5hA'); // MKBHD (Auto-generated usually)
  await test('fH3X2U9VzQA'); // Another common video
}

runTests();
