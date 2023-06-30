export const convertNumberToDate = (numberTypeDate: number): string => {
  const date = new Date(numberTypeDate);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};
