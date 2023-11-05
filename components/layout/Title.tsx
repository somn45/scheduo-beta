import Link from 'next/link';

export default function Title() {
  return (
    <li
      className={`h-header pt-3 sm:mr-4 md:mr-8 lg:mr-12 
  text-2xl font-solmee
  flex justify-center items-center`}
    >
      <Link
        href="/"
        className="pb-3 ease-out duration-150 hover:text-light-pink"
      >
        Scheduo
      </Link>
    </li>
  );
}
