export interface Address {
  id?: number;
  country?: string;
  province?: string;
  city?: string;
  zipCode?: string;
  doorNumber?: string;
  street?: string;
  floor?: string;
  name?: string;
  shippingDistance?: number;
}

export class AddressConversion {
  public static fromJson(json): Address {
    const jsonObject = json;

    const address: Address = {
      id: jsonObject.id,
      country: jsonObject.country,
      province: jsonObject.province,
      city: jsonObject.city,
      zipCode: jsonObject.zipCode,
      doorNumber: jsonObject.doorNumber,
      street: jsonObject.street,
      floor: jsonObject.floor,
      name: jsonObject.name,
      shippingDistance: jsonObject.shippingDistance,
    };

    return address;
  }

  public static toJson(value: Address): string {
    return JSON.stringify(value);
  }
}
