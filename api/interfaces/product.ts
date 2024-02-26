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

  public static fromXLSX(json: string): Product[] {
    const jsonArray = JSON.parse(json) as any[];
    return jsonArray.map((item) => this.transformItem(item));
  }

  private static transformItem(item: any): Product {
    let productComplete: Partial<Product> = {
      id: +item.ID,
      name: item["MODELISMI"],
      internalCode: item["NU"],
      supplierCode: item["URUNKODU"],
      value: +item["INDIRIMLIFIYAT"],
      priceBeforeDiscount: +item["INDIRIMSIZFIYAT"],
      depth: +item["DERINLIK(CM)"],
      width: +item["GENISLIK(CM)"],
      height: +item["TOTALYUKSEKLIK(CM)"],
      material: item["MATERYALTURU"],
      color: item["RENK"],
      product_extra: this.transformProductExtra(item),
    };

    return productComplete as Product;
  }

  private static transformProductExtra(item: any): ProductExtra {
    let productExtra: Partial<ProductExtra> = {
      id: +item.ID,
      weight: +item["AGIRLIK(KG)"],
      per_box: +item["KUTUICINDEKIMIKTAR"],
      packaged_weight: +item["KUTUAGIRLIGI(KG)"],
      packaged_dimension: item["KUTUBOYUTU"],
      seat_height: +item["OTURMAYUKSEKLIGI(CM)"],
      diameter: +item["CAP(CM)"],
      surface_area: item["EBAT(MASA)(CM)"],
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
      id: +normalizedItem["NU"],
      name: normalizedItem["MODELISMI"],
      internalCode: normalizedItem["URUNKODU"],
      supplierCode: normalizedItem["EANKODU"],
      value: +normalizedItem["INDIRIMLIFIYAT"],
      priceBeforeDiscount: +normalizedItem["INDIRIMSIZFIYAT"],
      depth: +normalizedItem["DERINLIK(CM)"],
      width: +normalizedItem["GENISLIK(CM)"],
      height: +normalizedItem["TOTALYUKSEKLIK(CM)"],
      material: normalizedItem["MATERYALTURU"],
      color: normalizedItem["RENK"],
      // category: this.transformCategory(normalizedItem),
      product_extra: this.transformProductExtra(normalizedItem),
    };

    return product as Product;
  }

  private static transformProductExtra(item: any): ProductExtra {
    let productExtra: ProductExtra = {
      id: +item["NU"],
      // armrest_height: ,
      // tags: ,
      // diameter: ,
      // surface_area: ,
      weight: +item["AGIRLIK(KG)"],
      per_box: +item["KUTUICINDEKIMIKTAR"],
      packaged_weight: +item["KUTUBRUTAGIRLIGI(KG)"],
      packaged_weight_net: +item["KUTUNETAGIRLIGI(KG)"],
      packaged_dimension: item["KUTUBOYUTU"],
      seat_height: +item["OTURMAYUKSEKLIGI(CM)"],
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
