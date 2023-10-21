interface UserProfileItemProps {
  caption: string;
  value: string;
}

export default function UserProfileItem({
  caption,
  value,
}: UserProfileItemProps) {
  return (
    <li className="w-full mb-8 flex flex-row justify-between">
      <h5 className="text-lg">{caption} : </h5>
      <span className="text-lgtext-slate-500">{value}</span>
    </li>
  );
}
