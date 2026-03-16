async function getTranscriptTrulyRobust(videoId) {
  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await response.text();
    
    // 1. Extract API Key
    const apiKeyMatch = html.match(/"INNERTUBE_API_KEY":"(.+?)"/);
    if (!apiKeyMatch) throw new Error('API Key not found');
    const apiKey = apiKeyMatch[1];
    
    // 2. Extract Transcript Params
    // Let's try to find it via a broader search in the whole HTML
    const paramsMatch = html.match(/"transcriptParams":"(.+?)"/);
    let params = paramsMatch ? paramsMatch[1] : null;
    
    if (!params) {
        // Broad search for anything that looks like transcript params in ytInitialData
        // It's often inside an engagement panel
        const m = html.match(/"engagementPanelSectionListRenderer".+?"params":"(A.+?)"/);
        if (m) params = m[1];
    }
    
    if (!params) {
        // Check for serialized params in a common format
        const m = html.match(/"params":"(A[a-zA-Z0-9_-]{10,})"/);
        if (m) params = m[1];
    }

    if (!params) throw new Error('Params not found even with broad search');

    console.log(`Key: ${apiKey.substring(0, 10)}..., Params: ${params.substring(0, 20)}...`);

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
    // console.log(JSON.stringify(data, null, 2));
    
    const cueGroups = data.actions?.[0]?.updateTranscriptAction?.transcriptRenderer?.body?.transcriptBodyRenderer?.cueGroups;
    if (!cueGroups) throw new Error('No cueGroups in InnerTube response');
    
    const text = cueGroups
      .map(group => {
          const cues = group.transcriptCueGroupRenderer?.cues;
          if (!cues) return '';
          return cues.map(cue => cue.transcriptCueRenderer?.formattedSnippet?.simpleText).join(' ');
      })
      .filter(Boolean)
      .join(' ');
      
    return text;
  } catch (e) {
    console.error('Truly Robust Extraction Error:', e.message);
    return null;
  }
}

getTranscriptTrulyRobust('dQw4w9WgXcQ').then(text => {
    if (text) {
        console.log('Final Text Length:', text.length);
        console.log('Start:', text.substring(0, 200));
    }
});
