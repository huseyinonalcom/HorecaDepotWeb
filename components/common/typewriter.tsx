import  { useState, useEffect } from "react";

type Props = {
  textTypeWriter: String[];
  delayChar?: number;
  delayString?: number;
};

const TypeWriter = ({ textTypeWriter, delayChar, delayString }: Props) => {
  const delayBetweenCharacters = delayChar ?? 60;
  const delayBetweenStrings = delayString ?? 3000;

  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [currentString, setCurrentString] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeoutId;

    const typeString = () => {
      const currentText = textTypeWriter[currentStringIndex];
      const currentIndex = isDeleting
        ? currentString.length - 1
        : currentString.length + 1;

      setCurrentString(currentText.substring(0, currentIndex));

      if (!isDeleting && currentString === currentText) {
        timeoutId = setTimeout(() => setIsDeleting(true), delayBetweenStrings);
      } else if (isDeleting && currentString === "") {
        setIsDeleting(false);
        setCurrentStringIndex(
          (prevIndex) => (prevIndex + 1) % textTypeWriter.length,
        );
        timeoutId = setTimeout(() => {
          setCurrentString("");
          timeoutId = setTimeout(typeString, delayBetweenCharacters);
        }, delayBetweenCharacters);
      } else {
        timeoutId = setTimeout(typeString, delayBetweenCharacters);
      }
    };

    timeoutId = setTimeout(typeString, delayBetweenCharacters);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentString, currentStringIndex, isDeleting]);

  return (
    <>
      <h4 className="w-fit px-2">{currentString}‎</h4>
    </>
  );
};

export default TypeWriter;
