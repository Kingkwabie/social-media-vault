export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    const { url } = req.body || {};

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Please provide a video URL'
      });
    }

    let parsed: URL;

    try {
      parsed = new URL(url.trim());
    } catch {
      return res.status(400).json({
        success: false,
        error: 'Invalid video URL'
      });
    }

    if (parsed.protocol !== 'https:') {
      return res.status(400).json({
        success: false,
        error: 'Only HTTPS URLs are supported'
      });
    }

    const domains = [
      'tiktok.com',
      'facebook.com',
      'fb.watch',
      'instagram.com',
      'youtube.com',
      'youtu.be',
      'threads.net',
      'snapchat.com',
      'x.com',
      'twitter.com',
      'pinterest.com',
      'pin.it'
    ];

    const hostname = parsed.hostname.toLowerCase();

    const supported = domains.some(domain =>
      hostname === domain ||
      hostname.endsWith('.' + domain)
    );

    if (!supported) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported platform'
      });
    }

    const apiUrl = new URL(
      'https://freeapi.pro/api/alldl'
    );

    apiUrl.searchParams.set('url', parsed.toString());

    timer = setTimeout(() => {
      controller.abort();
    },  50000);

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      signal: controller.signal
    });

    if (!response.ok) {
      console.error('FreeAPI HTTP error:', response.status);

      return res.status(502).json({
        success: false,
        error: 'Extraction service temporarily unavailable'
      });
    }

    const result = await response.json();

    if (!result || typeof result !== 'object') {
      return res.status(502).json({
        success: false,
        error: 'Invalid extraction service response'
      });
    }

    const media = result.mediaInfo;

    if (!result.success || !media || !media.videoUrl) {
      console.error('FreeAPI extraction failed:', {
        platform: hostname,
        response: result
      });

      return res.status(422).json({
        success: false,
        error: result.error || 'This video could not be extracted. Try another public video.'
      });
    }

    return res.status(200).json({
      success: true,
      mediaInfo: {
        title: media.title || 'Social Media Video',
        platform: media.platform || hostname,
        thumbnail: media.thumbnail || '',
        videoUrl: media.videoUrl,
        audioUrl: media.audioUrl || null,
        qualities: Array.isArray(media.qualities)
          ? media.qualities
          : []
      }
    });

  } catch (error: any) {
    console.error('Analyze API error:', error);

    return res.status(
      error?.name === 'AbortError' ? 504 : 500
    ).json({
      success: false,
      error: error?.name === 'AbortError'
        ? 'Video extraction timed out. Please try again.'
        : 'Unable to process video. Please try again.'
    });

  } finally {
    if (timer) clearTimeout(timer);
  }
}
