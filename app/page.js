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

        {/* LEFT */}
        <div className="flex flex-col gap-24 w-[650px]">
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

        {/* RIGHT */}
        <div className="flex flex-col gap-24 w-[650px]">
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

  let r4 = [];
  if (r3.length === 2) {
    const a = winners[`${region.name}-r3-0`];
    const b = winners[`${region.name}-r3-1`];
    if (a && b) r4 = [[a,b]];
  }

  const column = "flex flex-col items-center";
  const flow = direction === "left" ? "flex-row-reverse" : "";

  return (
    <div className="px-6 mb-24">

      <h2 className="text-xl font-bold mb-12 text-center">
        {region.name} — {region.location}
      </h2>

      <div className={`flex gap-32 ${flow}`}>

        {/* ROUND 1 */}
        <div className={`${column} gap-6`}>
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

        {/* ROUND 2 */}
        <div className={`${column} justify-around`}>
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

        {/* SWEET 16 */}
        <div className={`${column} justify-around`}>
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

        {/* ELITE 8 */}
        <div className={`${column} justify-center`}>
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

function GameCard({ gameKey, teamA, teamB, winners, setWinners, setSelectedTeam }) {
  const selected = winners[gameKey];

  const Row = ({ team }) => {
    if (!team) return null;

    const active = selected?.name === team.name;

    return (
      <div
        onClick={() => setWinners(prev => ({ ...prev, [gameKey]: team }))}
        className={`flex justify-between items-center px-3 py-2 text-sm cursor-pointer transition ${
          active ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="w-5 text-xs font-bold text-gray-500">{team.seed}</span>
          <span onClick={(e)=>{e.stopPropagation(); setSelectedTeam(team.name);}}>
            {team.name}
          </span>
        </div>
        {active && <span>✓</span>}
      </div>
    );
  };

  return (
    <div className="w-[220px] bg-white border border-gray-300 rounded shadow-sm">
      <Row team={teamA}/>
      <div className="border-t border-gray-200"/>
      <Row team={teamB}/>
    </div>
  );
}

function getTeamName(seedData) {
  if (!seedData) return "TBD";
  if (seedData.playIn) return `${seedData.teams[0]} / ${seedData.teams[1]}`;
  return seedData.team;
}

function TeamModal({ teamName, ratings, onClose }) {
  if (!ratings) return null;

  const powerScore = Math.round(
    ratings.offense * 0.4 +
    (100 - ratings.defense) * 0.4 +
    ratings.strengthOfSchedule * 0.2
  );

  const upsetRisk = Math.max(
    5,
    Math.min(60, 50 - ratings.netRating * 0.4 + (ratings.seed - 8) * 2)
  );

  const StatBar = ({ label, value, color }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="bg-gray-200 h-3 rounded">
        <div className={`${color} h-3 rounded transition-all duration-700`} style={{ width: `${value}%` }}/>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] p-8 rounded-2xl shadow-2xl relative">
        <button className="absolute top-4 right-5 text-xl font-bold" onClick={onClose}>✕</button>

        <h2 className="text-3xl font-bold mb-2">{teamName}</h2>
        <p className="text-gray-500 mb-6">
          Seed {ratings.seed} • Record {ratings.record}
        </p>

        <StatBar label="Overall Power" value={powerScore} color="bg-blue-600"/>
        <StatBar label="Offense" value={ratings.offense} color="bg-green-500"/>
        <StatBar label="Defense" value={ratings.defense} color="bg-red-500"/>
        <StatBar label="Strength of Schedule" value={ratings.strengthOfSchedule} color="bg-purple-500"/>
        <StatBar label="Upset Vulnerability" value={upsetRisk} color="bg-yellow-500"/>
      </div>
    </div>
  );
}