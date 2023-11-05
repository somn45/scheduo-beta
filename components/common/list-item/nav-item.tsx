import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavItemProps {
  linkHref: string;
  text: string;
}

export default function NavItem({ linkHref, text }: NavItemProps) {
  const router = useRouter();

  return (
    <li
      className={`h-header pt-3 sm:mr-4 md:mr-8 lg:mr-12 
      sm:text-sm md:text-base lg-text-lg
      flex justify-center items-center ${
        router.asPath === linkHref && 'border-b-4 border-black'
      }`}
    >
      <Link
        href={linkHref}
        className="pb-3 ease-out duration-150 hover:text-light-pink"
      >
        <span>{text}</span>
      </Link>
    </li>
  );
}
