export interface Establishment {
  id?: number;
  name?: string;
  cattegory?: string;
}

export class EstablishmentConversion {
  public static fromJson(json: string): Establishment {
    return json as unknown as Establishment;
  }

  public static toJson(value: Establishment): string {
    return JSON.stringify(value);
  }
}
