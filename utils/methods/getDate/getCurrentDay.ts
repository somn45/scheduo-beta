const getCurrentDay = () => {
  const currentDay = new Date(Date.now());
  const currentDaySharp = new Date(
    currentDay.getFullYear(),
    currentDay.getMonth(),
    currentDay.getDate(),
    9
  );
  return currentDaySharp;
};

export default getCurrentDay;
