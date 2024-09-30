import { getDownloadURL } from 'firebase-admin/storage';
import { serverStorage } from './config';

const bucketname =
  import.meta.env.SECRET_SERVER_FIREBASE_PROJECT_ID + '.appspot.com';

export const uploadImageBuffer = async (buffer: Buffer, name: string) => {
  const imgFile = serverStorage.bucket(bucketname).file(`foods/${name}`);
  await imgFile.save(buffer);
  return await getDownloadURL(imgFile);
};

export const deleteImage = async (slug: string) => {
  const imgFile = serverStorage.bucket(bucketname).file(`foods/${slug}`);
  return await imgFile.delete({ ignoreNotFound: true });
};
