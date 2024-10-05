import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: import.meta.env.SECRET_CLOUDINARY_NAME,
  api_key: import.meta.env.SECRET_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.SECRET_CLOUDINARY_API_SECRET,
});

const rootPath =
  (import.meta.env.PROD ? import.meta.env.SECRET_CLOUDINARY_ROOT : 'dev') + '/';

export const getImage = async (public_id: string) => {
  await cloudinary.api.resource(public_id);
};

export const saveImage = async (buffer: Buffer, public_id: string) => {
  try {
    const response = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            public_id: rootPath + public_id,
            format: 'webp',
          },
          (err, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(err);
            }
          },
        )
        .end(buffer);
    });
    return response.secure_url;
  } catch (error) {
    return;
  }
};

export const deleteImage = async (public_id: string) => {
  try {
    const response = new Promise<void>((resolve, reject) => {
      cloudinary.uploader.destroy(
        rootPath + public_id,
        { resource_type: 'image' },
        (error, result) => {
          if (result) return resolve(result);
          if (error) return reject(error);
          reject(new Error('Somethin went wrong'));
        },
      );
    });
    return response;
  } catch (error) {
    return undefined;
  }
};
