import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MobileNavItem from '../common/list-item/mobile-nav-item';

interface MobileNavProps {
  homeIcon: IconProp;
  todayIcon: IconProp;
  weeklyIcon: IconProp;
  monthIcon: IconProp;
}

export default function MobileNav({
  homeIcon,
  todayIcon,
  weeklyIcon,
  monthIcon,
}: MobileNavProps) {
  return (
    <footer
      className="w-full h-header border-t-2
      fixed bottom-0 left-0 sm:hidden z-30"
    >
      <nav className="h-full bg-white">
        <ul className="h-full flex justify-between">
          <MobileNavItem linkHref="/" icon={homeIcon} />
          <MobileNavItem linkHref="/schedules/today" icon={todayIcon} />
          <MobileNavItem linkHref="/schedules/weekly" icon={weeklyIcon} />
          <MobileNavItem linkHref="/schedules/monthly" icon={monthIcon} />
        </ul>
      </nav>
    </footer>
  );
}
