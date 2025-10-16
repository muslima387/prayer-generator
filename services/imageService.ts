
const FONT_FAMILY = "'Noto Kufi Arabic', sans-serif";

function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  
  for(let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = context.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}


export const generatePrayerImage = (bgUrl: string, prayerText: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return reject(new Error('Could not get canvas context.'));
    }

    const img = new Image();
    img.crossOrigin = 'anonymous'; 
    img.src = bgUrl;

    img.onload = () => {
      canvas.width = 1280;
      canvas.height = 720;
      
      // Draw background
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Add a semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Style text
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const maxWidth = canvas.width * 0.8;
      const x = canvas.width / 2;
      
      // Determine font size based on text length
      let fontSize = 52;
      if (prayerText.length > 100) {
        fontSize = 44;
      } else if (prayerText.length > 150) {
        fontSize = 38;
      }
      const lineHeight = fontSize * 1.5;
      
      ctx.font = `600 ${fontSize}px ${FONT_FAMILY}`;

      // Draw wrapped text
      wrapText(ctx, prayerText, x, canvas.height / 2, maxWidth, lineHeight);
      
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      reject(new Error('Failed to load background image.'));
    };
  });
};
