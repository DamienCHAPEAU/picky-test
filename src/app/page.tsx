import ImageUploadForm from '@/components/image-upload-form';

export default function Home() {
  return (
    <main className="container p-4 md:p-10 mx-auto">
      <h1 className="text-4xl font-semibold text-center mb-8">
        Image Management & Compression Mini-App
      </h1>
      <ImageUploadForm />
    </main>
  );
}
