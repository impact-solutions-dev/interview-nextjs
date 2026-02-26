import { db } from "./index";
import { generateDummyData } from "../utils/generateDummyData";

const TOTAL_ITEMS = 1000;

async function seed() {
  await db.schema
    .createTable("items")
    .ifNotExists()
    .addColumn("id", "integer", (col) =>
      col.autoIncrement().primaryKey().notNull(),
    )
    .addColumn("title", "text", (col) => col.notNull())
    .execute();

  await db.deleteFrom("items").execute();
  await db.insertInto("items").values(generateDummyData(TOTAL_ITEMS)).execute();
}

seed()
  .then(() => {
    console.log(`Seeded ${TOTAL_ITEMS} items into items table.`);
  })
  .catch((error: unknown) => {
    console.error("Seeding failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.destroy();
  });
