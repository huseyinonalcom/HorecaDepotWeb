import { Category } from "./category";
import { CFile } from "./cfile";
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
  height?: number;
  discountRange?: number;
  product_extra?: ProductExtra;
  images?: CFile[];
  productLine?: string;
  tax?: number;
  document_products?: DocumentProduct[];
  priceBeforeDiscount?: number;
  description?: string;
  material?: string;
  color?: string;
  shelves?: Shelf[];
  category?: Category;
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
      const normalizedKey = key.replace(/\s/g, "").toUpperCase();
      acc[normalizedKey] = item[key];
      return acc;
    }, {});

    let product: Product = {
      id: 0,
      name: normalizedItem["MODELISMI"],
      internalCode: normalizedItem["URUNKODU"],
      supplierCode: normalizedItem["EANKODU"]?.toString().replace(/[^0-9.]/g, ''),
      value: +normalizedItem["INDIRIMLIFIYAT"]?.toString().replace(/[^0-9.]/g, ''),
      priceBeforeDiscount: +normalizedItem["INDIRIMSIZFIYAT"]?.toString().replace(/[^0-9.]/g, ''),
      depth: +normalizedItem["DERINLIK(CM)"]?.toString().replace(/[^0-9.]/g, ''),
      width: +normalizedItem["GENISLIK(CM)"]?.toString().replace(/[^0-9.]/g, ''),
      height: +normalizedItem["TOTALYUKSEKLIK(CM)"]?.toString().replace(/[^0-9.]/g, ''),
      material: normalizedItem["MATERYALTURU"],
      color: normalizedItem["RENK"],
      product_extra: this.transformProductExtra(normalizedItem),
    };

    return product as Product;
  }

  private static transformProductExtra(item: any): ProductExtra {
    let productExtra: ProductExtra = {
      id: 0,
      armrest_height: +item["KOLDAYAMAYUKSEKLIGI(CM)"]?.toString().replace(/[^0-9.]/g, '') ,
      diameter: +item["CAP(CM)"]?.toString().replace(/[^0-9.]/g, '') ,
      weight: +item["AGIRLIK(KG)"]?.toString().replace(/[^0-9.]/g, ''),
      per_box: +item["KUTUICINDEKIMIKTAR"],
      packaged_weight: +item["KUTUBRUTAGIRLIGI(KG)"]?.toString().replace(/[^0-9.]/g, ''),
      packaged_weight_net: +item["KUTUNETAGIRLIGI(KG)"]?.toString().replace(/[^0-9.]/g, ''),
      packaged_dimensions: item["KUTUBOYUTU"],
      seat_height: +item["OTURMAYUKSEKLIGI(CM)"]?.toString().replace(/[^0-9.]/g, ''),
      barcode: item["EANKODU"],
    };

    Object.keys(productExtra).forEach((key) => {
      if (productExtra[key] === undefined) {
        productExtra[key] = null;
      }
    });

    return productExtra as ProductExtra;
  }
}
