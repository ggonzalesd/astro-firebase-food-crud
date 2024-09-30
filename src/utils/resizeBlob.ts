export const resizeBlob = async (blob: Blob, width: number, height: number) => {
  const newBlob = await new Promise<Blob>((resolve, reject) => {
    const blobUrl = URL.createObjectURL(blob);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    const img = document.createElement('img');
    img.src = blobUrl;
    img.onerror = function () {
      reject(new Error('Error Image'));
    };
    img.onload = function () {
      if (context) {
        context.scale(width / img.width, height / img.height);
        context.drawImage(img, 0, 0);
        canvas.toBlob(
          (canvasBlob) => {
            URL.revokeObjectURL(blobUrl);
            if (canvasBlob) resolve(canvasBlob);
            else reject(new Error('No Blob found!'));
          },
          'image/jpeg',
          '0.5',
        );
      } else {
        URL.revokeObjectURL(blobUrl);
        reject(new Error('No Context'));
      }
    };
  });
  return await newBlob.arrayBuffer();
};

export const arrayToBase64 = (resized: ArrayBuffer) => {
  const buffer = new Uint8Array(resized);
  const buffer_string = buffer.reduce(
    (acc, c) => acc + String.fromCharCode(c),
    '',
  );
  return btoa(buffer_string);
};
