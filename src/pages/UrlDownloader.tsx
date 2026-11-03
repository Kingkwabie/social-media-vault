const handleDownload = (quality: 'HD' | 'SD') => {
    if (!preview) return;

    let downloadUrl = preview.videoUrl;

    if (preview.qualities.length > 0) {
      const selected = preview.qualities.find(item =>
        quality === 'HD'
          ? /720p|1080p|1440p|2160p/i.test(item.quality)
          : /360p|480p/i.test(item.quality)
      );

      if (selected) {
        downloadUrl = selected.url;
      }
    }

    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
  };
