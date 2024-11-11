import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
}

const ImageWithURL: React.FC<SafeImageProps> = ({
  src,
  alt,
  ...otherProps
}) => {
  if (!src) {
    src = "/uploads/placeholder_9db455d1f1.webp";
  }
  return (
    <Image
      src={`https://hdapi.huseyinonalalpha.com${src}`}
      alt={alt}
      {...otherProps}
    />
  );
};

export default ImageWithURL;
