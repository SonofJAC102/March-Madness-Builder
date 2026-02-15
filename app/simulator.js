export function simulateGame(teamA, teamB, round) {
  const seedA = teamA.seed;
  const seedB = teamB.seed;

  const betterTeam = seedA < seedB ? teamA : teamB;
  const worseTeam = seedA < seedB ? teamB : teamA;

  const seedDiff = Math.abs(seedA - seedB);

  let betterWinProbability = 0.5;

  if (seedDiff >= 15) betterWinProbability = 0.99;
  else if (seedDiff >= 13) betterWinProbability = 0.94;
  else if (seedDiff >= 11) betterWinProbability = 0.85;
  else if (seedDiff >= 9) betterWinProbability = 0.79;
  else if (seedDiff >= 7) betterWinProbability = 0.65;
  else if (seedDiff >= 5) betterWinProbability = 0.60;
  else if (seedDiff >= 3) betterWinProbability = 0.55;

  if (round === 2) betterWinProbability -= 0.05;
  if (round === 3) betterWinProbability -= 0.1;

  const random = Math.random();
  const winner =
    random < betterWinProbability ? betterTeam : worseTeam;
  const loser = winner === teamA ? teamB : teamA;

  // Guaranteed no tie
  const winnerScore = 75 + Math.floor(Math.random() * 20);
  const loserScore = winnerScore - (5 + Math.floor(Math.random() * 10));

  return {
    winner,
    loser,
    winnerScore,
    loserScore,
    isUpset: winner.seed > loser.seed
  };
}
