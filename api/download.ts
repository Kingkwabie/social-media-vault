export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const videoUrl = req.query.url;

    if (!videoUrl || typeof videoUrl !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing video URL'
      });
    }

    const parsed = new URL(videoUrl);

    if (parsed.protocol !== 'https:') {
      return res.status(400).json({
        success: false,
        error: 'Invalid video URL'
      });
    }

    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok || !response.body) {
      return res.status(502).json({
        success: false,
        error: 'Unable to retrieve video'
      });
    }

    const contentType = response.headers.get('content-type') || '';

    if (!contentType.startsWith('video/')) {
      return res.status(415).json({
        success: false,
        error: 'The link does not return a video file'
      });
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="social-video.mp4"'
    );

    if (response.headers.get('content-length')) {
      res.setHeader(
        'Content-Length',
        response.headers.get('content-length')!
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    return res.status(200).send(buffer);

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Download failed. Please try again.'
    });
  }
}
