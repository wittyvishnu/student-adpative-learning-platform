import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex items-center">
        <span className="text-2xl font-bold flex items-center">
          <Image src="/image.png" alt="Logo" width={30} height={30} className="mr-1 mt-1 inline-block" />
          Pin <span className="text-[#9efa35] ml-2">IT</span>
        </span>
      </div>
    </Link>
  );
}
