import { Generated } from "kysely";

export interface CategoryTable {
  id: Generated<number>;
  name: string;
}

export interface ItemTable {
  id: Generated<number>;
  title: string;
  categoryId: number;
}

export interface Database {
  categories: CategoryTable;
  items: ItemTable;
}
