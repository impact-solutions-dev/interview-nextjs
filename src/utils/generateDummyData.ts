import { DummyItem } from "@/types/DummyItem";

export function generateDummyData(count: number): DummyItem[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `Item ${index + 1}`,
  }));
}
