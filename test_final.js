async function getTranscriptFinal(videoId) {
  try {
    const jsonUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&fmt=json3`;
    console.log(`Fetching JSON transcript from: ${jsonUrl}`);
    
    const response = await fetch(jsonUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.youtube.com'
      }
    });
    
    const data = await response.json();
    if (!data.events) throw new Error('No events in JSON transcript');
    
    const transcriptText = data.events
      .map(event => event.segs?.map(seg => seg.utf8).join(''))
      .filter(Boolean)
      .join(' ');
      
    return transcriptText;
  } catch (e) {
    console.error('Final Extraction Error:', e.message);
    return null;
  }
}

getTranscriptFinal('dQw4w9WgXcQ').then(text => {
    if (text) {
        console.log('Final Text Length:', text.length);
        console.log('Start:', text.substring(0, 200));
    }
});
