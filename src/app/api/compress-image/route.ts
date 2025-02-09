import { env } from '@/env';
import { db } from '@/lib/db/drizzle';
import { files as filesTable } from '@/lib/db/schema';
import { uploadFileToBucket } from '@/lib/minio';
import { imageUploadFormatSchema } from '@/lib/zod';
import { eq } from 'drizzle-orm';
import sharp from 'sharp';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const imageFile = formData.get('imageFile') as File;
  const imageId = formData.get('imageId') as string;
  const imageType = imageFile.type.split('/')[1];

  if (!imageFile) {
    return NextResponse.json({ error: 'No file selected' }, { status: 400 });
  }
  // check if the image format is supported
  const parsedFormat = imageUploadFormatSchema.safeParse(imageType);
  if (!parsedFormat.success) {
    return NextResponse.json(
      { error: 'Unsupported file format' },
      { status: 400 }
    );
  }
  const format = parsedFormat.data === 'jpg' ? 'jpeg' : parsedFormat.data;
  try {
    // transform the file to a buffer, compress it and upload it to the bucket
    const imageFileBuffer = Buffer.from(await imageFile.arrayBuffer());

    const compressedBuffer = await sharp(imageFileBuffer)
      .resize(200, 200, {
        fit: 'inside',
      })
      [format]()
      .toBuffer();

    await uploadFileToBucket(
      env.S3_BUCKET_NAME,
      compressedBuffer,
      `compressed-${imageFile.name}`
    );

    // update the db with the compressed path
    const image = await db
      .update(filesTable)
      .set({
        compressedPath: `${env.S3_BUCKET_NAME}/compressed-${imageFile.name}`,
      })
      .where(eq(filesTable.id, parseInt(imageId)));

    return NextResponse.json(
      {
        id: image.lastInsertRowid,
        path: `${env.S3_BUCKET_NAME}/compressed-${imageFile.name}`,
        size: compressedBuffer.byteLength,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
