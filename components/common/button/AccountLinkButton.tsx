interface AccountLinkButtonProps {
  value: string;
  onClick: (() => void) | undefined;
}

export default function AccountLinkButton({
  value,
  onClick,
}: AccountLinkButtonProps) {
  return (
    <button
      value={value}
      onClick={onClick}
      className="text-center font-semibold ease-out duration-100 hover:text-light-pink"
    >
      {value}
    </button>
  );
}
