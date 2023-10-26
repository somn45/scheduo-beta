import { ChangeEvent, useState } from 'react';

type useInputType = (
  initialState: string
) => [string, (e: ChangeEvent<HTMLInputElement>) => void, () => void];

const useInput: useInputType = (initialState) => {
  const [input, setInput] = useState(initialState);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInput(e.target.value);
  };

  const reset = () => setInput('');
  return [input, onChange, reset];
};

export default useInput;
