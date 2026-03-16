async function getTranscriptInnerTube(videoId) {
  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    const html = await response.text();
    
    // 1. Extract API Key
    const apiKeyMatch = html.match(/"INNERTUBE_API_KEY":"(.+?)"/);
    if (!apiKeyMatch) throw new Error('API Key not found');
    const apiKey = apiKeyMatch[1];
    
    // 2. Extract Client Context (Simplified)
    // We can use a standard one, but let's try to find it
    const clientNameMatch = html.match(/"clientName":"(.+?)"/);
    const clientVersionMatch = html.match(/"clientVersion":"(.+?)"/);
    
    // 3. Extract Transcript Params
    // This is the tricky part. We need the params for the get_transcript request.
    // Usually it's in the playerResponse or some specific config.
    const paramsMatch = html.match(/"transcriptParams":"(.+?)"/);
    // If not found, we might need to get it from the full playerResponse
    let params = paramsMatch ? paramsMatch[1] : null;
    
    if (!params) {
        const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
        if (playerResponseMatch) {
            const playerResponse = JSON.parse(playerResponseMatch[1]);
            // Search deeply for transcriptParams? 
            // Actually, for get_transcript, we can just try to find it in the HTML
            // Another common place:
            const m = html.match(/"params":"(A.+?)"/); // Look for something that looks like params
            if (m) params = m[1];
        }
    }
    
    if (!params) {
        // Fallback: This video might not have the params directly. 
        // We'll try the older getSubtitles method as a last resort if this fails.
        throw new Error('Transcript params not found');
    }

    console.log(`Using Key: ${apiKey.substring(0, 10)}..., Params: ${params}`);

    const transcriptResponse = await fetch(`https://www.youtube.com/youtubei/v1/get_transcript?key=${apiKey}`, {
      method: 'POST',
      body: JSON.stringify({
        context: {
          client: {
            clientName: "WEB",
            clientVersion: "2.20240316.00.00"
          }
        },
        params: params
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await transcriptResponse.json();
    const body = data.actions?.[0]?.updateTranscriptAction?.transcriptRenderer?.body?.transcriptBodyRenderer?.body?.transcriptBodyRenderer;
    // Actually, let's just log the full response to find the correct path
    // console.log(JSON.stringify(data, null, 2));
    
    // Usually it's: data.actions[0].updateTranscriptAction.transcriptRenderer.body.transcriptBodyRenderer.cueGroups
    const segments = data.actions?.[0]?.updateTranscriptAction?.transcriptRenderer?.body?.transcriptBodyRenderer?.cueGroups;
    if (!segments) throw new Error('No transcript segments found');
    
    const transcriptText = segments
      .map(group => group.transcriptCueGroupRenderer?.cues?.[0]?.transcriptCueRenderer?.formattedSnippet?.simpleText)
      .filter(Boolean)
      .join(' ');
      
    return transcriptText;
  } catch (e) {
    console.error('InnerTube extraction failed:', e.message);
    return null;
  }
}

async function test() {
  const videoId = 'dQw4w9WgXcQ';
  const text = await getTranscriptInnerTube(videoId);
  if (text) {
    console.log('Success!');
    console.log('Text:', text.substring(0, 100) + '...');
  }
}

test();
