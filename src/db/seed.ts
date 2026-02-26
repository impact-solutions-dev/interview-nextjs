import { db } from "./index";
import { generateDummyData } from "../utils/generateDummyData";

const TOTAL_ITEMS = 1000;

const CATEGORIES = [
  { id: 1, name: "Hardware" },
  { id: 2, name: "Software" },
  { id: 3, name: "Služby" },
];

async function seed() {
  await db.schema.dropTable("items").ifExists().execute();
  await db.schema.dropTable("categories").ifExists().execute();

  await db.schema
    .createTable("categories")
    .addColumn("id", "integer", (col) =>
      col.autoIncrement().primaryKey().notNull(),
    )
    .addColumn("name", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("items")
    .addColumn("id", "integer", (col) =>
      col.autoIncrement().primaryKey().notNull(),
    )
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("categoryId", "integer", (col) =>
      col.references("categories.id").notNull(),
    )
    .execute();
  await db.insertInto("categories").values(CATEGORIES).execute();
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
