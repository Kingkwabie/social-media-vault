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
      'threads.com',
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
    }, 50000);

    console.log('Starting extraction:', hostname);

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      signal: controller.signal
    });

    if (!response.ok) {
      const errorDetails = await response.text();

      console.error('FreeAPI HTTP error:', {
        status: response.status,
        details: errorDetails
      });

      return res.status(502).json({
        success: false,
        error: `FreeAPI error (${response.status}): ${errorDetails.slice(0, 300)}`
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
        error: result.error ||
          'This video could not be extracted. Try another public video.'
      });
    }

    const videoUrl = media.videoUrl;

    let validVideoUrl: URL;

    try {
      validVideoUrl = new URL(videoUrl);
    } catch {
      return res.status(502).json({
        success: false,
        error: 'Extraction service returned an invalid video link'
      });
    }

    if (validVideoUrl.protocol !== 'https:') {
      return res.status(502).json({
        success: false,
        error: 'Extraction service returned an unsupported video link'
      });
    }

    const thumbnail =
      typeof media.thumbnail === 'string' &&
      media.thumbnail.startsWith('https://')
        ? media.thumbnail
        : '';

    console.log('Extraction successful:', {
      platform: media.platform || hostname,
      hasThumbnail: Boolean(thumbnail),
      hasVideoUrl: Boolean(videoUrl)
    });

    return res.status(200).json({
      success: true,
      mediaInfo: {
        title: media.title || 'Social Media Video',
        platform: media.platform || hostname,
        thumbnail,
        videoUrl,
        audioUrl: media.audioUrl || null,
        qualities: Array.isArray(media.qualities)
          ? media.qualities
          : []
      }
    });

  } catch (error: any) {
    console.error('Analyze API error:', error);

    if (error?.name === 'AbortError') {
      return res.status(504).json({
        success: false,
        error: 'Video extraction timed out. Please try again.'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Unable to process video. Please try again.'
    });

  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}
