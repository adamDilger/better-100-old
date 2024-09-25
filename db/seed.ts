import { db, Countdown } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db
    .insert(Countdown)
    .values([{ id: 1, code: "KHCY", name: `Alex's Bucks` }]);

  // await db.insert(Person).values([]);
  // await db.insert(Vote).values([]);
}

// {
//   name: 'adam',
//   votes: [
//     {
//       id: 'q3zqJs7JUCQ',
//       title: 'Taylor Swift - Fortnight (feat. Post Malone) (Official Music Video)',
//       thumbnailUrl: 'https://i.ytimg.com/vi/q3zqJs7JUCQ/default.jpg',
//       thumbnailLgUrl: 'https://i.ytimg.com/vi/q3zqJs7JUCQ/hqdefault.jpg'
//     },
//     {
//       id: 'Sl6en1NPTYM',
//       title: 'Taylor Swift - I Can Do It With A Broken Heart (Official Video)',
//       thumbnailUrl: 'https://i.ytimg.com/vi/Sl6en1NPTYM/default.jpg',
//       thumbnailLgUrl: 'https://i.ytimg.com/vi/Sl6en1NPTYM/hqdefault.jpg'
//     },
//     {
//       id: '852A78TnZGM',
//       title: 'Taylor',
//       thumbnailUrl: 'https://i.ytimg.com/vi/852A78TnZGM/default.jpg',
//       thumbnailLgUrl: 'https://i.ytimg.com/vi/852A78TnZGM/hqdefault.jpg'
//     }
//   ]
// }
