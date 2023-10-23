import { inputClickEvent } from '@/types/HTMLEvents';
import { Dispatch, SetStateAction, useState } from 'react';

interface SearchFollowerFormProps {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  handleSearchFollowers: (e: inputClickEvent) => Promise<void>;
}

export default function SearchFollowerForm({
  text,
  setText,
  handleSearchFollowers,
}: SearchFollowerFormProps) {
  return (
    <form className="w-80 mb-6 relative">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="팔로우 검색"
        className="w-80 h-8 px-2 border-2 border-input-color rounded-md"
      />
      <input
        type="submit"
        value="검색"
        onClick={handleSearchFollowers}
        className="font-semibold absolute right-3 top-1 cursor-pointer"
      />
    </form>
  );
}
