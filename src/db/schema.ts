import { Generated } from "kysely";

export interface ItemTable {
  id: Generated<number>;
  title: string;
}

export interface Database {
  items: ItemTable;
}
