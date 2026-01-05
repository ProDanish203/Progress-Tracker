import { navLinks } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="container mx-auto flex items-center justify-between py-2 sm:px-8 px-4">
      <div className="">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="logo"
            className="object-contain"
            width={50}
            height={50}
          />
        </Link>
      </div>
      <nav className="flex items-center sm:gap-x-8 gap-x-4">
        {navLinks.map(({ label, href }, idx) => (
          <Link
            key={idx}
            href={href}
            className="sm:text-lg hover:text-primary transition-all duration-300"
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
};
