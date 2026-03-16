async function inspectPlayerResponse(videoId) {
  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    const html = await response.text();
    
    const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
    if (playerResponseMatch) {
        const playerResponse = JSON.parse(playerResponseMatch[1]);
        console.log('Captions found:', !!playerResponse.captions);
        if (playerResponse.captions) {
            console.log('Caption Tracks:', JSON.stringify(playerResponse.captions.playerCaptionsTracklistRenderer?.captionTracks, null, 2));
        } else {
            console.log('No captions object in playerResponse');
            // Sometimes it's in ytInitialData instead
            const initialDataMatch = html.match(/ytInitialData\s*=\s*({.+?});/);
            if (initialDataMatch) {
                console.log('ytInitialData found, searching for transcript params...');
                // Usually deeply nested in engagement panels
                if (html.includes('engagementPanelSectionListRenderer')) {
                    console.log('engagementPanelSectionListRenderer found in HTML');
                }
            }
        }
    } else {
        console.log('ytInitialPlayerResponse not found');
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

inspectPlayerResponse('dQw4w9WgXcQ');
