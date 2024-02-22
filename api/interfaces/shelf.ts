import { Establishment } from "./establishment";

export interface Shelf {
  id?: number;
  stock?: number;
  supplier_order_products?: any[];
  establishment?: Establishment;
}
