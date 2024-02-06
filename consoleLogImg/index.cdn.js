async function consoleLogImage(imageUrl, consoleImageWidth = 24) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const originalImage = await new Promise((res, rej) => {
    const _img = new Image();
    _img.onload = () => res(_img);
    _img.onerror = () => rej("error loading image");
    _img.src = imageUrl;
  });

  const originalWidth = originalImage.width;
  const originalHeight = originalImage.height;

  const pixelationFactor = Math.ceil(originalWidth / consoleImageWidth);
  const pixelationFactorArray = new Array(pixelationFactor)
    .fill(0)
    .map((_, i) => i);
  const canvasWidth = consoleImageWidth;
  const canvasHeight = (originalHeight * consoleImageWidth) / originalWidth;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // turn off image aliasing
  context.msImageSmoothingEnabled = false;
  context.mozImageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;

  context.drawImage(originalImage, 0, 0, canvasWidth, canvasHeight);
  const originalImageData = context.getImageData(
    0,
    0,
    canvasWidth,
    canvasHeight
  ).data;

  const logo = [];
  if (pixelationFactor !== 0) {
    for (let y = 0; y < canvasHeight; y += 1) {
      const row = [];
      logo.push(row);
      for (let x = 0; x < canvasWidth; x += 1) {
        // Calculate the center pixel coordinates within the block
        const centerX = x; //+ Math.floor(pixelationFactor / 2);
        const centerY = y; //+ Math.floor(pixelationFactor / 2);

        // Extracting the position of the center pixel
        const pixelIndexPosition = (centerX + centerY * canvasWidth) * 4;
        const r = originalImageData[pixelIndexPosition];
        const g = originalImageData[pixelIndexPosition + 1];
        const b = originalImageData[pixelIndexPosition + 2];
        const a = originalImageData[pixelIndexPosition + 3];

        row.push(`rgba(${r || 0}, ${g || 0}, ${b || 0}, ${a | 0})`);
      }
    }
  }
  
  console.log()

  const colors = [];
  const maxHeight = logo.length;
  let maxWidth = 0;
  for (const row of logo) {
    maxWidth = Math.max(row.length, maxWidth);
    for (const color of row) {
      const c = color || "transparent";
      colors.push(`background: ${c}; color: ${c}`);
    }
  }
  
  const pixels = new Array(maxHeight)
    .fill(new Array(maxWidth).fill("%c__").join(""))
    .join("\n");

  console.log(pixels, ...colors);

  return canvas.toDataURL();
}
