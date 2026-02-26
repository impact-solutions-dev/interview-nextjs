const NUM_CATEGORIES = 3;

export function generateDummyData(count: number): { title: string; categoryId: number }[] {
  return Array.from({ length: count }, (_, index) => ({
    title: `Item ${index + 1}`,
    categoryId: (index % NUM_CATEGORIES) + 1,
  }));
}
