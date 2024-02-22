export interface CFile {
  id?: number;
  url?: string;
}

export class CFileConversion {
  public static fromJson(json: string): CFile {
    return json as CFile;
  }

  public static toJson(value: CFile): string {
    return JSON.stringify(value);
  }
}
