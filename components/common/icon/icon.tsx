import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Icon({ icon }: { icon: IconProp }) {
  return <FontAwesomeIcon icon={icon} className="text-xl" />;
}
