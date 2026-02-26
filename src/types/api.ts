import { DummyItem } from "./DummyItem";

export type ItemsApiResponse = {
  items: DummyItem[];
  page: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
};
