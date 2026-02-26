import { LibsqlDialect } from "@libsql/kysely-libsql";
import { Kysely } from "kysely";
import { Database } from "./schema";

export const db = new Kysely<Database>({
  dialect: new LibsqlDialect({
    url: "file:local.db",
  }),
});
