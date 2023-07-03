const daysFromNow = (date) => {
  return Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24)) === 0
    ? " today"
    : Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24)) === 1
    ? " yesterday"
    : Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24)) > 1
    ? ` ${Math.floor(
        (new Date() - new Date(date)) / (1000 * 60 * 60 * 24)
      )} days ago`
    : null;
};
export default daysFromNow;
