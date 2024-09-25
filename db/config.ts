import { column, defineDb, defineTable } from "astro:db";

const Countdown = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    code: column.text(),
    name: column.text(),
    started: column.date({ optional: true }),
    maxVoteCount: column.number({ default: 5 }),
    password: column.text({ optional: true }),
  },
  indexes: [{ on: ["code"], unique: true }],
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
    countdownId: column.number({ references: () => Countdown.columns.id }),
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
    Countdown,
    Person,
    Vote,
  },
});
