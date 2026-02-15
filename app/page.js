"use client";

import bracketData from "./data/bracketProjection.json";
import { generateTeamRatings } from "./engine/ratingEngine";
import { useState } from "react";

const ratings = generateTeamRatings(bracketData);

export default function Home() {
  const [winners, setWinners] = useState({});
  const [selectedTeam, setSelectedTeam] = useState(null);

  const regionChampions = bracketData.regions.map(region =>
    winners[`${region.name}-r4-0`]
  );

  const semifinalWinners = [
    winners["finalfour-1"],
    winners["finalfour-2"]
  ];

  const finalFourReady = regionChampions.every(Boolean);
  const championshipReady = semifinalWinners.every(Boolean);

  return (
    <div className="min-h-screen bg-gray-200 p-10 overflow-x-auto">
      <h1 className="text-4xl font-bold text-center mb-16">
        🏀 2026 March Madness Builder
      </h1>

      <div className="min-w-[2000px] flex justify-center gap-32">

        {/* LEFT SIDE */}
        <div className="flex flex-col gap-32 w-[650px]">
          <Region region={bracketData.regions[0]} winners={winners} setWinners={setWinners} setSelectedTeam={setSelectedTeam}/>
          <Region region={bracketData.regions[1]} winners={winners} setWinners={setWinners} setSelectedTeam={setSelectedTeam}/>
        </div>

        {/* CENTER */}
        <div className="flex flex-col items-center w-[500px] mt-40">
          {finalFourReady && (
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full text-center">
              <h2 className="text-2xl font-bold mb-8">Final Four</h2>

              <GameCard gameKey="finalfour-1" teamA={regionChampions[0]} teamB={regionChampions[1]} winners={winners} setWinners={setWinners} setSelectedTeam={setSelectedTeam}/>
              <GameCard gameKey="finalfour-2" teamA={regionChampions[2]} teamB={regionChampions[3]} winners={winners} setWinners={setWinners} setSelectedTeam={setSelectedTeam}/>

              {championshipReady && (
                <>
                  <h3 className="text-xl font-semibold mt-10 mb-4">Championship</h3>
                  <GameCard gameKey="championship" teamA={semifinalWinners[0]} teamB={semifinalWinners[1]} winners={winners} setWinners={setWinners} setSelectedTeam={setSelectedTeam}/>
                </>
              )}

              {winners["championship"] && (
                <div className="mt-10 text-3xl font-bold text-blue-700">
                  🏆 {winners["championship"].name}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-32 w-[650px]">
          <Region region={bracketData.regions[2]} direction="left" winners={winners} setWinners={setWinners} setSelectedTeam={setSelectedTeam}/>
          <Region region={bracketData.regions[3]} direction="left" winners={winners} setWinners={setWinners} setSelectedTeam={setSelectedTeam}/>
        </div>

      </div>

      {selectedTeam && (
        <TeamModal
          teamName={selectedTeam}
          ratings={ratings[selectedTeam]}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </div>
  );
}

function Region({ region, winners, setWinners, setSelectedTeam, direction = "right" }) {

  const matchups = [
    [1,16],[8,9],[5,12],[4,13],
    [6,11],[3,14],[7,10],[2,15]
  ];

  const r1Keys = matchups.map(([seed]) => `${region.name}-r1-${seed}`);

  const r2 = [];
  for (let i = 0; i < r1Keys.length; i += 2) {
    const a = winners[r1Keys[i]];
    const b = winners[r1Keys[i+1]];
    if (a && b) r2.push([a,b]);
  }

  const r3 = [];
  for (let i = 0; i < r2.length; i += 2) {
    const a = winners[`${region.name}-r2-${i}`];
    const b = winners[`${region.name}-r2-${i+1}`];
    if (a && b) r3.push([a,b]);
  }

  const r4 = [];
  if (r3.length === 2) {
    const a = winners[`${region.name}-r3-0`];
    const b = winners[`${region.name}-r3-1`];
    if (a && b) r4.push([a,b]);
  }

  const flow = direction === "left" ? "flex-row-reverse" : "";

  return (
    <div className="px-6 mb-32">

      <h2 className="text-xl font-bold mb-12 text-center">
        {region.name} — {region.location}
      </h2>

      <div className={`flex gap-32 ${flow}`}>

        {/* Round 1 */}
        <div className="flex flex-col gap-6">
          {matchups.map(([seedA, seedB]) => {
            const key = `${region.name}-r1-${seedA}`;
            return (
              <GameCard
                key={key}
                gameKey={key}
                teamA={{ name: getTeamName(region.seeds[seedA]), seed: seedA }}
                teamB={{ name: getTeamName(region.seeds[seedB]), seed: seedB }}
                winners={winners}
                setWinners={setWinners}
                setSelectedTeam={setSelectedTeam}
              />
            );
          })}
        </div>

        {/* Round 2 */}
        <div className="flex flex-col justify-around min-h-[600px]">
          {r2.map((pair, i) => (
            <GameCard
              key={`${region.name}-r2-${i}`}
              gameKey={`${region.name}-r2-${i}`}
              teamA={pair[0]}
              teamB={pair[1]}
              winners={winners}
              setWinners={setWinners}
              setSelectedTeam={setSelectedTeam}
            />
          ))}
        </div>

        {/* Sweet 16 */}
        <div className="flex flex-col justify-around min-h-[400px]">
          {r3.map((pair, i) => (
            <GameCard
              key={`${region.name}-r3-${i}`}
              gameKey={`${region.name}-r3-${i}`}
              teamA={pair[0]}
              teamB={pair[1]}
              winners={winners}
              setWinners={setWinners}
              setSelectedTeam={setSelectedTeam}
            />
          ))}
        </div>

        {/* Elite 8 */}
        <div className="flex flex-col justify-center min-h-[200px]">
          {r4.map((pair, i) => (
            <GameCard
              key={`${region.name}-r4-${i}`}
              gameKey={`${region.name}-r4-${i}`}
              teamA={pair[0]}
              teamB={pair[1]}
              winners={winners}
              setWinners={setWinners}
              setSelectedTeam={setSelectedTeam}
            />
          ))}
        </div>

      </div>
    </div>
  );
}