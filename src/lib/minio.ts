import * as Minio from 'minio';
import { env } from '@/env';

// Mini client configuration to connect to the local minio server (in our case)
export const minioClient = new Minio.Client({
  endPoint: env.S3_ENDPOINT!,
  port: env.S3_PORT ? parseInt(env.S3_PORT) : 9000,
  useSSL: false,
  accessKey: env.S3_ACCESS_KEY,
  secretKey: env.S3_SECRET_KEY,
});

export async function createBucketIfNotExists(bucketName: string) {
  const bucketExists = await minioClient.bucketExists(bucketName);
  if (!bucketExists) {
    await minioClient.makeBucket(bucketName);
  }
}

export async function uploadFileToBucket(
  bucketName: string,
  file: Buffer,
  fileName: string
) {
  await createBucketIfNotExists(bucketName);

  await minioClient.putObject(bucketName, fileName, file);
}

export async function getFileFromBucket({
  bucketName,
  fileName,
}: {
  bucketName: string;
  fileName: string;
}) {
  try {
    // check if the file exists
    await minioClient.statObject(bucketName, fileName);
  } catch (error) {
    console.error(error);
    return null;
  }
  return await minioClient.getObject(bucketName, fileName);
}
