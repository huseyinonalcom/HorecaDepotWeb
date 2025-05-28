import { Category } from "./category";
import { CFile } from "./cfile";
import { Color } from "./color";
import { DocumentProduct } from "./documentProduct";
import { ProductExtra } from "./productExtra";
import { Shelf } from "./shelf";

export interface Product {
  id?: number;
  name?: string;
  active?: boolean;
  supplierCode?: string;
  internalCode?: string;
  value?: number;
  depth?: number;
  width?: number;
  stock?: number;
  minStock?: number;
  minOrder?: number;
  height?: number;
  discountRange?: number;
  product_extra?: ProductExtra;
  images?: CFile[];
  productLine?: string;
  tax?: number;
  document_products?: DocumentProduct[];
  priceBeforeDiscount?: number;
  description?: string;
  localized_description?: Record<string, string>;
  localized_name?: Record<string, string>;
  material?: string;
  product_color?: Color;
  color?: string;
  shelves?: Shelf[];
  categories?: Category[];
  supplier?: any;
  imageDirections?: any;
  reserved?: number;
}

export class ProductConversion {
  public static fromJson(json: string): Product {
    return JSON.parse(json);
  }

  public static toJson(value: Product): string {
    return JSON.stringify(value);
  }
}

export class ProductTransformer {
  public static fromXLSX(json: string): Product[] {
    const jsonArray = JSON.parse(json);
    return jsonArray.map((item) => this.transformItem(item));
  }

  private static transformItem(item: any): Product {
    const normalizedItem = Object.keys(item).reduce((acc, key) => {
      const normalizedKey = key.replace(/\s/g, "").toLowerCase();
      acc[normalizedKey] = item[key];
      return acc;
    }, {});

    let product: Product = {
      id: 0,
      name: normalizedItem["nom"],
      internalCode: normalizedItem["codemodel"],
      supplierCode: normalizedItem["ean"]?.toString().replace(/[^0-9.]/g, ""),
      value: +normalizedItem["prixdevente"]?.toString().replace(/[^0-9.]/g, ""),
      priceBeforeDiscount: +normalizedItem["prixavantremise"]
        ?.toString()
        .replace(/[^0-9.]/g, ""),
      depth: +normalizedItem["longueur"]?.toString().replace(/[^0-9.]/g, ""),
      width: +normalizedItem["largeur"]?.toString().replace(/[^0-9.]/g, ""),
      height: +normalizedItem["hauteur"]?.toString().replace(/[^0-9.]/g, ""),
      material: normalizedItem["matériel"],
      product_color: normalizedItem["couleur"],
      product_extra: this.transformProductExtra(normalizedItem),
      shelves: [
        { id: 1, stock: +normalizedItem["stockmagasin"] },
        { id: 3, stock: +normalizedItem["stockdepot"] },
      ],
    };

    return product as Product;
  }

  private static transformProductExtra(item: any): ProductExtra {
    let productExtra: ProductExtra = {
      id: 0,
      armrest_height: +item["hauteuraccoudoir"]
        ?.toString()
        .replace(/[^0-9.]/g, ""),
      diameter: +item["diamètre"]?.toString().replace(/[^0-9.]/g, ""),
      weight: +item["poids"]?.toString().replace(/[^0-9.]/g, ""),
      per_box: +item["parboîte"],
      packaged_weight: +item["poidscolisbrut"]
        ?.toString()
        .replace(/[^0-9.]/g, ""),
      packaged_weight_net: +item["poidscolisnet"]
        ?.toString()
        .replace(/[^0-9.]/g, ""),
      packaged_dimensions: item["dimensionsducolis"],
      seat_height: +item["hauteurd'assise"]?.toString().replace(/[^0-9.]/g, ""),
      barcode: item["ean"],
    };

    Object.keys(productExtra).forEach((key) => {
      if (productExtra[key] === undefined) {
        productExtra[key] = null;
      }
    });

    return productExtra as ProductExtra;
  }
}
