import { column, defineDb, defineTable } from "astro:db";

const Event = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    code: column.text(),
    name: column.text(),
  },
});

const Person = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
  },
});

const Vote = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    eventId: column.number({ references: () => Event.columns.id }),
    personId: column.number({ references: () => Person.columns.id }),
    title: column.text(),
    videoId: column.text(),
    thumbnailUrl: column.text(),
    thumbnailLgUrl: column.text(),
    playedOn: column.date({ optional: true }),
    sort: column.number(),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    Event,
    Person,
    Vote,
  },
});
