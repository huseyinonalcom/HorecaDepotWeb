export const formatDateAPIToBe = (date) => {
  try {
    const splitString: string[] = date.split("-");
    const reversedSplitString: string[] = splitString.reverse();
    const formattedDate: string = reversedSplitString.join("-");
    return formattedDate;
  } catch (error) {
    return date;
  }
};

export const formatDateTimeAPIToBe = (dateString) => {
  const date = new Date(dateString);
  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = String(date.getFullYear()).slice(-2);
  let hours = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");
  let seconds = String(date.getSeconds()).padStart(2, "0");

  return {
    date: `${day}-${month}-${year}`,
    time: `${hours}:${minutes}:${seconds}`,
  };
};
