import { CFile } from "./cfile";
import { Product } from "./product";

export interface Color {
  id?: number;
  name?: string;
  code?: string;
  image?: CFile;
  products?: Product[];
}

export class ColorConversion {
  public static fromJson(json: string): Color {
    return JSON.parse(json);
  }

  public static toJson(value: Color): string {
    return JSON.stringify(value);
  }
}
