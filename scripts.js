const bannerImages = [
  './assets/vbanner/banner1.png',
  './assets/vbanner/banner2.png',
  './assets/vbanner/banner3.png',
];

window.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById('randomised_banner');
  if (!banner) return;

  const randomIndex = Math.floor(Math.random() * bannerImages.length);
  banner.src = bannerImages[randomIndex];

  banner.onload = () => {
    const maxWidth = 255;
    const maxHeight = 1024;
    let imgWidth = banner.naturalWidth;
    let imgHeight = banner.naturalHeight;

    if (imgWidth > maxWidth || imgHeight > maxHeight) {
      const cropWidth = Math.min(imgWidth, maxWidth);
      const cropHeight = Math.min(imgHeight, maxHeight);

      const startX = Math.floor((imgWidth - cropWidth) / 2);
      const startY = Math.floor((imgHeight - cropHeight) / 2);

      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        banner,
        startX, startY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
      );

      banner.src = canvas.toDataURL();
      banner.style.width = maxWidth + 'px';
      banner.style.height = 'auto';
    } else {
      banner.style.width = maxWidth + 'px';
      banner.style.height = 'auto';
    }
  };
});