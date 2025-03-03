import { Address, AddressConversion } from "./address";
import { User } from "./user";

export interface Client extends User {
  client_info?: ClientInfo;
}

interface ClientInfo {
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
}

export class ClientConversion {
  public static fromJson(json): Client {
    const jsonObject = json;

    const client: Client = {
      id: jsonObject.id,
      username: jsonObject.username,
      email: jsonObject.email,
      client_info: {
        id: jsonObject.client_info?.id,
        firstName: jsonObject.client_info?.firstName,
        lastName: jsonObject.client_info?.lastName,
        phone: jsonObject.client_info?.phone,
        category: jsonObject.client_info?.category,
        company: jsonObject.client_info?.company,
        taxID: jsonObject.client_info?.taxID,
        email: jsonObject.client_info?.email,
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

  public static toJson(value: Client): string {
    return JSON.stringify(value);
  }
}
