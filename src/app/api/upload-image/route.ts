import { env } from '@/env';
import { db } from '@/lib/db/drizzle';
import { files as filesTable } from '@/lib/db/schema';
import { uploadFileToBucket } from '@/lib/minio';
import { imageUploadFormatSchema } from '@/lib/zod';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const imageFile = formData.get('imageFile') as File;
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

  try {
    const uniqueFileName = `${Date.now()}-${imageFile.name}`;
    // transform the file to a buffer and upload it to the bucket
    const imageFileBuffer = Buffer.from(await imageFile.arrayBuffer());
    await uploadFileToBucket(
      env.S3_BUCKET_NAME,
      imageFileBuffer,
      uniqueFileName
    );

    // insert to db
    const image = await db.insert(filesTable).values({
      fileName: uniqueFileName,
      compressedPath: '',
      size: imageFile.size,
      originalName: imageFile.name,
      mimeType: imageFile.type,
      path: `${env.S3_BUCKET_NAME}/${uniqueFileName}`,
    });

    return NextResponse.json(
      {
        success: true,
        id: image.lastInsertRowid,
        path: `${env.S3_BUCKET_NAME}/${uniqueFileName}`,
        size: imageFile.size,
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
