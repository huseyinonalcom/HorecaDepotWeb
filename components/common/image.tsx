import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
}

export function imageUrl(url: string) {
  return `https://hdcdn.hocecomv1.com${url.replace("https://hdcdn.hocecomv1.com", "")}`;
}

const ImageWithURL: React.FC<SafeImageProps> = ({
  src,
  alt,
  ...otherProps
}) => {
  if (!src) {
    src = "/uploads/placeholder_9db455d1f1.webp";
  }
  return <Image src={imageUrl(src)} alt={alt} {...otherProps} />;
};

export default ImageWithURL;
