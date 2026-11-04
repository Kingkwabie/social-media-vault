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

    const hostname = parsed.hostname.toLowerCase();

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

    const isSupported = domains.some(domain =>
      hostname === domain ||
      hostname.endsWith('.' + domain)
    );

    if (!isSupported) {
      return res.status(400).json({
        success: false,
        error: `Unsupported platform: ${hostname}`
      });
    }

    if (
      hostname === 'threads.com' ||
      hostname.endsWith('.threads.com') ||
      hostname === 'threads.net' ||
      hostname.endsWith('.threads.net')
    ) {
      const isThreadsPost =
        /^\/@[^/]+\/post\/[A-Za-z0-9_-]+\/?$/.test(parsed.pathname) ||
        /^\/t\/[A-Za-z0-9_-]+\/?$/.test(parsed.pathname);

      if (!isThreadsPost) {
        return res.status(400).json({
          success: false,
          error: 'Invalid Threads post link'
        });
      }
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
      const details = await response.text();

      console.error('FreeAPI HTTP error:', {
        status: response.status,
        details
      });

      return res.status(502).json({
        success: false,
        error: `FreeAPI error (${response.status}): ${details.slice(0, 300)}`
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
      console.error('Extraction failed:', result);

      return res.status(422).json({
        success: false,
        error: result.error ||
          'This video could not be extracted.'
      });
    }

    let videoUrl: URL;

    try {
      videoUrl = new URL(media.videoUrl);
    } catch {
      return res.status(502).json({
        success: false,
        error: 'Invalid video link returned by extraction service'
      });
    }

    if (videoUrl.protocol !== 'https:') {
      return res.status(502).json({
        success: false,
        error: 'Unsupported video link returned by extraction service'
      });
    }

    const thumbnail =
      typeof media.thumbnail === 'string' &&
      media.thumbnail.startsWith('https://')
        ? media.thumbnail
        : '';

    return res.status(200).json({
      success: true,
      mediaInfo: {
        title: media.title || 'Social Media Video',
        platform: media.platform || hostname,
        thumbnail,
        videoUrl: videoUrl.toString(),
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
        ? 'Video extraction timed out.'
        : 'Unable to process video.'
    });

  } finally {
    if (timer) clearTimeout(timer);
  }
}
