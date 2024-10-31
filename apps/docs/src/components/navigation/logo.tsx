import Link from "next/link";
import Image from "next/image";

export function Logo() {
    return (
      <Link href="/" className="flex items-center gap-2.5">
        <Image width={24} height={24} src="/logo.webp" alt="NEAR Blockchain logo" />
        <h1 className="text-md font-semibold">Docs</h1>
      </Link>
    );
}