import { InfiniteList } from "@/components/InfiniteList";
import { getItemsPage } from "@/lib/items";

export default async function Home() {
  const initialData = await getItemsPage(1);

  return (
    <div className="min-h-screen py-8 px-4">
      <h1 className="text-4xl font-bold text-center py-4">
        FIRE Systems - Interview
      </h1>
      <InfiniteList initialData={initialData} />
    </div>
  );
}
