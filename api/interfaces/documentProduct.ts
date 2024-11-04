//   import { DocumentProductConversion, DocumentProduct } from "/api/interfaces/documentProduct.ts";
//   const documentProduct = DocumentProductConversion.fromJson(json);

import { Category } from "./category";

export interface DocumentProduct {
  id?: number;
  name?: string;
  description?: string;
  priceBeforeDiscount?: number;
  value?: number;
  subTotal?: number;
  discount?: number;
  amount?: number;
  tax?: number;
  taxSubTotal?: number;
  delivered?: boolean;
  document?: number;
  product?: number;
  category?: Category;
  shelf?: number;
  shelfStock?: number;
}

export class DocumentProductConversion {
  public static fromJson(json: string): DocumentProduct {
    return json as DocumentProduct;
  }

  public static toJson(value: DocumentProduct): string {
    return JSON.stringify(value);
  }
}
