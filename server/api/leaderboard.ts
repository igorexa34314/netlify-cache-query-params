import { faker } from '@faker-js/faker';

export default defineCachedEventHandler(
   event => {
      const leaderboardTypes = ['cookies', 'streak', 'work', 'votes', 'hours'];

      return leaderboardTypes.reduce((acc, type) => {
         acc[type] = generateRandomUserPoints(50);
         return acc;
      }, {} as Record<string, ReturnType<typeof generateRandomUserPoints>>);
   },
   { maxAge: 60 }
);

function generateRandomUserPoints(count: number) {
   const users = Array.from({ length: count }, () => ({
      id: faker.string.uuid(),
      fullname: faker.person.fullName(),
      points: faker.number.int({ min: 1000, max: 10000 }),
   }));

   return [...users].sort((a, b) => a.points - b.points).map((user, idx) => ({ ...user, place: idx + 1 }));
}
