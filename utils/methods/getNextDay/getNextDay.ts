const getNextDay = () => {
  const nextDay = new Date(Date.now() + 1000 * 60 * 60 * 24);
  const nextDaySharp = new Date(
    nextDay.getFullYear(),
    nextDay.getMonth(),
    nextDay.getDate(),
    9
  );
  return nextDaySharp;
};

export default getNextDay;
