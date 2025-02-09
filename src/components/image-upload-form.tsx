'use client';

import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { formatFileSize } from '@/lib/utils';

type ApiImageType = {
  id: number;
  path: string;
  size: number;
};

export default function ImageUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadImage, setUploadImage] = useState<ApiImageType>();
  const [compressedImage, setCompressedImage] = useState<ApiImageType>();
  const [loading, setLoading] = useState<'uploading' | 'compressing' | null>(
    null
  );
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      return toast({
        title: 'Error',
        description: 'No file image selected',
        variant: 'destructive',
      });
    }
    setLoading('uploading');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('imageFile', file);
      const responseUpload = await fetch('/api/upload-image', {
        method: 'POST',
        body: formDataUpload,
      });
      if (!responseUpload.ok) throw new Error('Failed to upload image');
      const dataUpload = (await responseUpload.json()) as
        | ApiImageType
        | { error: string };

      if ('error' in dataUpload) {
        return toast({
          title: 'Error',
          description: dataUpload.error,
          variant: 'destructive',
        });
      }

      setUploadImage({
        id: dataUpload.id,
        path: dataUpload.path,
        size: dataUpload.size,
      });

      setLoading('compressing');

      const formDataCompress = new FormData();
      formDataCompress.append('imageFile', file);
      formDataCompress.append('imageId', dataUpload.id.toString());

      const responseCompress = await fetch('/api/compress-image', {
        method: 'POST',
        body: formDataCompress,
      });
      if (!responseCompress.ok) throw new Error('Failed to upload image');
      const dataCompress = (await responseCompress.json()) as
        | ApiImageType
        | { error: string };

      if ('error' in dataCompress) {
        return toast({
          title: 'Error',
          description: dataCompress.error,
          variant: 'destructive',
        });
      }

      setCompressedImage({
        id: dataCompress.id,
        path: dataCompress.path,
        size: dataCompress.size,
      });

      toast({
        title: 'Success',
        description: 'Image compressed successfully',
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
      setFile(null);
      setPreview(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-md:w-full flex flex-col items-center justify-center"
    >
      <div
        {...getRootProps()}
        className={`flex h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-primary w-full max-w-screen md:w-[500px] ${
          isDragActive ? 'checker-bg' : ''
        }`}
      >
        <input
          id="image_upload"
          className="hidden"
          type="file"
          accept="image/png, image/jpeg, image/webp, image/jpg"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFile(file);
              setPreview(URL.createObjectURL(file));
            }
          }}
          {...getInputProps()}
        />
        {preview ? (
          <div className="relative h-full">
            {loading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                <Loader2 className="size-10 animate-spin stroke-[#f06384]" />
                <p className="mt-1 text-sm font-semibold text-[#f06384]">
                  {loading}
                </p>
              </div>
            )}
            <img
              src={preview}
              alt="Uploaded Preview"
              className={`z-10 h-full rounded-lg object-contain ${
                loading && 'blur-sm'
              }`}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <Upload className="size-10" />
            <p className="mb-2 text-sm">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
          </div>
        )}
      </div>
      <Button type="submit" disabled={!file || loading !== null}>
        Upload and Compress Image
      </Button>
      {uploadImage && compressedImage && (
        <div className="mt-8">
          <h2 className="text-lg text-center font-semibold mb-4">
            Image Comparison
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium text-center">Original Image</h3>
              <div className="flex h-[300px] flex-col items-center justify-center w-full max-w-screen md:w-[500px] gap-3">
                <img
                  src={`http://localhost:9000/${uploadImage.path}`}
                  alt="original image"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Size: {formatFileSize(uploadImage.size)}
              </p>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium text-center">Compressed Image</h3>
              <div className="flex h-[300px] flex-col items-center justify-center w-full max-w-screen md:w-[500px] gap-3">
                <img
                  src={`http://localhost:9000/${compressedImage.path}`}
                  alt="compressed image"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Size: {formatFileSize(compressedImage.size)}
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
