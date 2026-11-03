export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

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
      parsed = new URL(url);
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

    apiUrl.searchParams.set('url', url);

    const controller = new AbortController();

    const timer = setTimeout(
      () => controller.abort(),
      25000
    );

    let response;

    try {
      response = await fetch(apiUrl.toString(), {
        signal: controller.signal
      });
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        error: 'Video extraction service failed'
      });
    }

    const result = await response.json();

    if (
      !result.success ||
      !result.mediaInfo?.videoUrl
    ) {
      return res.status(422).json({
        success: false,
        error: 'Could not extract this video'
      });
    }

    const media = result.mediaInfo;

    return res.status(200).json({
      success: true,
      mediaInfo: {
        title: media.title,
        platform: media.platform,
        thumbnail: media.thumbnail,
        videoUrl: media.videoUrl,
        audioUrl: media.audioUrl || null,
        qualities: media.qualities || []
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to process video. Please try again.'
    });
  }
}
