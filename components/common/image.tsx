import Image, { ImageProps } from "next/image";

const ImageWithURL: React.FC<ImageProps> = ({ src, alt, ...otherProps }) => {
  return (
    <Image
      src={`https://hdapi.huseyinonalalpha.com${src}`}
      alt={alt}
      {...otherProps}
    />
  );
};

export default ImageWithURL;
