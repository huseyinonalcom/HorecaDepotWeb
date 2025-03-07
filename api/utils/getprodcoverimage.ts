import { Product } from "../interfaces/product";

export const getCoverImageUrl = (prd: Product) => {
  if (prd.images == null || prd.images.length == 0) {
    return "/uploads/placeholder_9db455d1f1.webp";
  }
  if (prd.imageDirections && prd.imageDirections.fr != 0) {
    return (
      prd.images
        .find((img) => img.id == prd.imageDirections.fr)
        ?.url.replace("https://hdcdn.hocecomv1.com", "") ??
      prd.images.at(0)?.url.replace("https://hdcdn.hocecomv1.com", "") ??
      "/uploads/placeholder_9db455d1f1.webp"
    );
  } else {
    return (
      prd.images.at(0)?.url.replace("https://hdcdn.hocecomv1.com", "") ??
      "/uploads/placeholder_9db455d1f1.webp"
    );
  }
};
