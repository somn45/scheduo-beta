const getCurrentDay = () => {
  const currentDay = new Date(Date.now());

  // 서버 시간을 한국 시간으로 조정
  const currentDaySharp = new Date(
    currentDay.getFullYear(),
    currentDay.getMonth(),
    currentDay.getDate(),
    9
  );
  return currentDaySharp;
};

export default getCurrentDay;
