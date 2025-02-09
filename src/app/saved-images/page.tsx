import { db } from '@/lib/db/drizzle';

export default async function SavedImages() {
  const images = await db.query.files.findMany();

  return (
    <main className="min-h-screen container p-4 md:p-10 mx-auto">
      <h1 className="text-4xl font-semibold text-center mb-8">Saved Images</h1>
      {images.length === 0 && (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-lg text-gray-600">No images found</p>
        </div>
      )}
      {images.map((image) => (
        <div className="mt-8" key={image.id}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium text-center">Original Image</h3>
              <div className="flex h-[300px] flex-col items-center justify-center w-full max-w-screen md:w-[500px] gap-3">
                <img
                  src={`http://localhost:9000/${image.path}`}
                  alt="original image"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium text-center">Compressed Image</h3>
              <div className="flex h-[300px] flex-col items-center justify-center w-full max-w-screen md:w-[500px] gap-3">
                <img
                  src={`http://localhost:9000/${image.compressedPath}`}
                  alt="compressed image"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}
