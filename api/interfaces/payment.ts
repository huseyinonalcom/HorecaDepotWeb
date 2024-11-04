export interface Payment {
  id?: number;
  value?: number;
  date?: string;
  method?: string;
  note?: string;
  verified?: boolean;
  origin?: string;
  deleted?: boolean;
}

export class PaymentConversion {
    public static fromJson(json: string): Payment {
      return json as Payment;
    }
  
    public static toJson(value: Payment): string {
      return JSON.stringify(value);
    }
  }