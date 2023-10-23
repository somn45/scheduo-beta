interface AccountInputProps {
  name: string;
  value: string;
  onChange: (value: React.SetStateAction<string>) => void;
  errorMsg: string;
}

export default function AccountInput({
  name,
  value,
  onChange,
  errorMsg,
}: AccountInputProps) {
  return (
    <>
      <input
        type={name === 'password' ? 'password' : 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={name}
        className={`h-8 mb-1 p-2 border-b-2 outline-none rounded-[3px] text-sm focus:outline-black ${
          errorMsg && 'border-red-300'
        }`}
      />
      <span className="ml-2 mb-5 text-red-600">{errorMsg}</span>
    </>
  );
}
