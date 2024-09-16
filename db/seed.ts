import { db, Person, Vote } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Person).values([
    { id: 1, name: "Adam" },
    { id: 2, name: "Jack" },
    { id: 3, name: "Alex" },
  ]);

  await db.insert(Vote).values([
    {
      id: 1,
      personId: 2,
      title: "Charli xcx - Apple",
      videoId: "ipe8cfJNt_o",
      sort: Math.floor(Math.random() * 100000000),
    },
    {
      id: 2,
      personId: 1,
      title: "Fontaines D.C. - Bug",
      videoId: "OxBflEDvf-o",
      sort: Math.floor(Math.random() * 100000000),
    },
    {
      id: 3,
      personId: 3,
      title: "King Gizzard & The Lizard Wizard - Sleep Drifter",
      videoId: "U72rbtrufws",
      sort: Math.floor(Math.random() * 100000000),
    },
  ]);
}
