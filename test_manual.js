async function getTranscriptManual(videoId) {
  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    const html = await response.text();
    
    // Find ytInitialPlayerResponse
    const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
    if (!playerResponseMatch) throw new Error('Could not find player response');
    
    const playerResponse = JSON.parse(playerResponseMatch[1]);
    const captions = playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    
    if (!captions || captions.length === 0) throw new Error('No captions found');
    
    // Find English track or first track
    const track = captions.find(t => t.languageCode === 'en') || captions[0];
    const transcriptResponse = await fetch(track.baseUrl);
    const transcriptXml = await transcriptResponse.text();
    
    // Very simple XML text extraction
    const transcriptText = transcriptXml
      .match(/text.+?>(.+?)<\/text/g)
      .map(t => t.match(/>(.+?)</)[1])
      .map(t => t.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>'))
      .join(' ');
      
    return transcriptText;
  } catch (e) {
    console.error('Manual extraction failed:', e.message);
    return null;
  }
}

async function test() {
  const videoId = 'dQw4w9WgXcQ';
  const text = await getTranscriptManual(videoId);
  if (text) {
    console.log('Success!');
    console.log('Text:', text.substring(0, 100) + '...');
  }
}

test();
