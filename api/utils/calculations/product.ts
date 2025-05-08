import { Product } from "../../interfaces/product";

export function calculateProductStock(product: Product): number {
  let calculatedStock: number = 0;

  if (!product.shelves) {
    return 0;
  } else {
    let initialStock: number = 0;
    product.shelves.forEach((shelf) => (initialStock += shelf.stock));
    let totalReceieved: number = 0;
    if (
      product.shelves.some((shelf) => shelf.supplier_order_products.length > 0)
    ) {
      product.shelves.forEach(
        (shelf) =>
          (totalReceieved += shelf.supplier_order_products["amountReceived"]),
      );
    }
    let totalSold: number = 0;
    if (product.document_products) {
      product.document_products.forEach(
        (docProd) => (totalSold += docProd["amount"]),
      );
    }
    calculatedStock = initialStock + totalReceieved - totalSold;
  }

  return calculatedStock;
}
