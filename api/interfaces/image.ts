export interface Image {
  id?: number;
  name?: string;
  url?: string;
}

export class ImageConversion {
  public static fromJson(json): Image {
    const jsonObject = json;

    const address: Image = {
      id: jsonObject.id,
      name: jsonObject.name,
      url: jsonObject.url,
    };

    return address;
  }

  public static toJson(value: Image): string {
    return JSON.stringify(value);
  }
}
