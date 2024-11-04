import { Product } from "../interfaces/product";

export const getCoverImageUrl = (prd: Product) => {
  if (prd.imageDirections && prd.imageDirections.fr != 0) {
    return (
      prd.images.find((img) => img.id == prd.imageDirections.fr)?.url ??
      prd.images.at(0)?.url ??
      "/uploads/placeholder_9db455d1f1.webp"
    );
  } else {
    return prd.images.at(0)?.url ?? "/uploads/placeholder_9db455d1f1.webp";
  }
};
