import { ChangeEvent } from 'react';

interface AccountInputProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
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
        name={name}
        value={value}
        onChange={onChange}
        placeholder={name}
        className={`w-full max-w-md h-8 mb-1 p-2 border-b-2 outline-none rounded-[3px] text-sm focus:outline-black ${
          errorMsg && 'border-red-300'
        }`}
      />
      <span className="ml-2 mb-5 text-red-600">{errorMsg}</span>
    </>
  );
}
