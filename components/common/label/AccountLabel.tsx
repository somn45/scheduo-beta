interface AccountLabelProps {
  caption: string;
}

export default function AccountLabel({ caption }: AccountLabelProps) {
  return (
    <label className="w-full max-w-md ml-2 mb-1 text-xs text-left font-semibold">
      <span>{caption}</span>
    </label>
  );
}
