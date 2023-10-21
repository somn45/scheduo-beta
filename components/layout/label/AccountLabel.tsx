interface AccountLabelProps {
  caption: string;
}

export default function AccountLabel({ caption }: AccountLabelProps) {
  return <label className="ml-2 mb-1 text-xs font-semibold">{caption}</label>;
}
