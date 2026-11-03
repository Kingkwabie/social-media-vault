export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    const videoUrl = req.query.url;

    if (!videoUrl || typeof videoUrl !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing video URL'
      });
    }

    let parsed: URL;

    try {
      parsed = new URL(videoUrl);
    } catch {
      return res.status(400).json({
        success: false,
        error: 'Invalid video URL'
      });
    }

    if (parsed.protocol !== 'https:') {
      return res.status(400).json({
        success: false,
        error: 'Only HTTPS video links are supported'
      });
    }

    timer = setTimeout(() => {
      controller.abort();
    }, 50000);

    const response = await fetch(parsed.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'video/*, application/octet-stream, */*'
      },
      signal: controller.signal
    });

    if (!response.ok || !response.body) {
      console.error('Video download HTTP error:', response.status);

      return res.status(502).json({
        success: false,
        error: 'Unable to retrieve the video. The video link may have expired.'
      });
    }

    const contentType = (
      response.headers.get('content-type') || ''
    ).toLowerCase();

    const isVideo =
      contentType.startsWith('video/') ||
      contentType === 'application/octet-stream';

    if (!isVideo) {
      console.error('Unexpected video content type:', contentType);

      return res.status(415).json({
        success: false,
        error: 'The server did not return a supported video file'
      });
    }

    const buffer = Buffer.from(
      await response.arrayBuffer()
    );

    if (buffer.length === 0) {
      return res.status(502).json({
        success: false,
        error: 'The downloaded video is empty'
      });
    }

    res.setHeader(
      'Content-Type',
      contentType || 'video/mp4'
    );

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="social-video.mp4"'
    );

    res.setHeader(
      'Content-Length',
      buffer.length
    );

    res.setHeader(
      'Cache-Control',
      'no-store'
    );

    return res.status(200).send(buffer);

  } catch (error: any) {
    console.error('Download API error:', error);

    if (error?.name === 'AbortError') {
      return res.status(504).json({
        success: false,
        error: 'Video download timed out. Please try again.'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Download failed. Please try again.'
    });

  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}
