import { CFile } from "./cfile";
import { Product } from "./product";

export interface Collection {
  id?: number;
  name?: string;
  category?: string;
  description?: string;
  images?: CFile[];
  products?: Product[];
}

export class CollectionConversion {
  public static fromJson(json): Collection {
    const jsonObject = json;

    const collection: Collection = {
      id: jsonObject.id,
      name: jsonObject.name,
      category: jsonObject.category,
      description: jsonObject.description,
    };

    return collection;
  }

  public static toJson(value: Collection): string {
    return JSON.stringify(value);
  }
}
