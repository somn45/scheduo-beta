import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Link from 'next/link';
import Icon from '../icon/icon';
import { useRouter } from 'next/router';

interface MobileNavItemProps {
  linkHref: string;
  icon: IconProp;
}

export default function MobileNavItem({ linkHref, icon }: MobileNavItemProps) {
  const router = useRouter();
  return (
    <li
      className={`w-1/4 border-r-2 last:border-r-0 ${
        router.asPath === linkHref && 'border-t-4 border-t-black'
      } flex justify-center items-center`}
    >
      <Link href={linkHref}>
        <Icon icon={icon} />
      </Link>
    </li>
  );
}
