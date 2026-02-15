// Generates realistic KenPom-style ratings automatically

export function generateTeamRatings(bracketData) {
  const ratings = {};

  bracketData.regions.forEach(region => {
    Object.entries(region.seeds).forEach(([seed, data]) => {
      if (data.playIn) {
        data.teams.forEach(teamName => {
          ratings[teamName] = createRating(seed);
        });
      } else {
        ratings[data.team] = createRating(seed);
      }
    });
  });

  return ratings;
}

function createRating(seed) {
  // Better seeds get better baseline ratings
  const base = 100 - (seed * 1.8);

  const offense = randomBetween(base + 5, base + 15);
  const defense = randomBetween(base - 15, base - 5);

  const net = offense - defense;
  const tempo = randomBetween(60, 75);

  const sos = randomBetween(5, 25); // strength of schedule
  const wins = Math.floor(randomBetween(18, 30));
  const losses = Math.floor(randomBetween(3, 12));

  return {
    seed: Number(seed),
    offense: Number(offense.toFixed(1)),
    defense: Number(defense.toFixed(1)),
    netRating: Number(net.toFixed(1)),
    tempo: Number(tempo.toFixed(1)),
    strengthOfSchedule: Number(sos.toFixed(1)),
    record: `${wins}-${losses}`
  };
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
