import { Address, AddressConversion } from "./address";
import { User } from "./user";

export interface ClientUser extends User {
  client_info?: Client;
}

export interface Client {
  id?: number;
  firstName?: string;
  lastName?: string;
  deleted?: boolean;
  phone?: string;
  category?: string;
  company?: string;
  taxID?: string;
  addresses?: Address[];
  email?: string;
  login?: User;
}

export class ClientConversion {
  public static fromJson(json): ClientUser {
    const jsonObject = json;

    const client: ClientUser = {
      id: jsonObject.id,
      username: jsonObject.username,
      email: jsonObject.email,
      client_info: {
        id: jsonObject.client_info?.id,
        email: jsonObject.email,
        firstName: jsonObject.client_info?.firstName,
        lastName: jsonObject.client_info?.lastName,
        phone: jsonObject.client_info?.phone,
        category: jsonObject.client_info?.category,
        company: jsonObject.client_info?.company,
        taxID: jsonObject.client_info?.taxID,
      },
    };

    if (
      jsonObject.client_info?.addresses &&
      jsonObject.client_info?.addresses.length > 0
    ) {
      client.client_info.addresses = jsonObject.client_info.addresses.map(
        (ad) => AddressConversion.fromJson(ad),
      );
    }

    return client;
  }

  public static toJson(value: ClientUser): string {
    return JSON.stringify(value);
  }
}
