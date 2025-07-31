/* 
{
    "user": null, -----            consider user interface for this
    "support_tickets": [], -----   make support_ticket interface for this
    "tasks": [], -----             consider task interface for this
}
*/

import { DocumentProduct } from "./documentProduct";
import { Address } from "./address";
import { Payment } from "./payment";
import { Client } from "./client";
import { CFile } from "./cfile";

//   import { DocumentConversion, Document } from "/api/interfaces/Document.ts";
//   const Document = DocumentConversion.fromJson(json);

export interface Document {
  id?: number;
  number?: string;
  date?: string;
  client?: Client;
  type?: string;
  invoiced?: boolean;
  prefix?: string;
  data?: string;
  phase?: number;
  comment?: string;
  reference?: string;
  note?: string;
  invoice?: boolean;
  deleted?: boolean;
  decisionMaker?: string;
  managerNote?: string;
  files?: CFile[];
  document_products?: DocumentProduct[];
  docAddress?: Address;
  delAddress?: Address;
  payments?: Payment[];
  establishment?: number;
}

export class DocumentConversion {
  public static fromJson(json: string): Document {
    return json as unknown as Document;
  }

  public static toJson(value: Document): string {
    return JSON.stringify(value);
  }
}
