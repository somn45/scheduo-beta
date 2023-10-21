import { inputClickEvent } from '@/types/HTMLEvents';

interface AccountSubmitProps {
  value: string;
  onClick: (e: inputClickEvent) => Promise<void>;
  isDisabledSubmit: boolean;
}

export default function AccountSubmit({
  value,
  onClick,
  isDisabledSubmit,
}: AccountSubmitProps) {
  return (
    <>
      <input
        type="submit"
        value={value}
        onClick={onClick}
        disabled={isDisabledSubmit}
        className={`h-8 mb-3 p-1 bg-blue-400 border-none outline-none rounded-[3px] text-white font-semibold ease-out duration-200 ${
          isDisabledSubmit
            ? 'opacity-20'
            : 'opacity-100 cursor-pointer hover:bg-blue-600'
        }`}
      />
    </>
  );
}
