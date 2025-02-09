import { ImageUp } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="flex-shrink-0 border-b">
      <div className="container flex h-16 items-center gap-4 px-4 sm:gap-10 sm:px-6">
        <Link
          className="flex items-center gap-2"
          href="/"
          aria-label="Picky Test"
        >
          <ImageUp className="h-8 w-8" />
          <span className="text-lg font-bold">Picky Test</span>
        </Link>
        <div className="items-center gap-4 flex">
          <Link href="/saved-images" className="text-base hover:underline">
            Saved Image
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
