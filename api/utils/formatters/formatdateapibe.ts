const formatDateAPIToBe = (date) => {
  const splitString: string[] = date.split("-");
  const reversedSplitString: string[] = splitString.reverse();
  const formattedDate: string = reversedSplitString.join("-");
  return formattedDate;
};

export default formatDateAPIToBe;
