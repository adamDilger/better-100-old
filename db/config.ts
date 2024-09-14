import { column, defineDb, defineTable } from "astro:db";

const Person = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
  },
});

const Vote = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    personId: column.number({ references: () => Person.columns.id }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    Person,
    Vote,
  },
});
