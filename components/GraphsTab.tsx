'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Session {
  id: string;
  date: string;
  week: number;
  sessionNumber: number;
  blocA: { name: string; sets: number[] }[];
  score: number;
}

interface WeightEntry {
  date: string;
  week: number;
  weight: number;
}

interface StepsEntry {
  date: string;
  steps: number;
}

interface AlcoholEntry {
  date: string;
  glasses: number;
}

export default function GraphsTab() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [stepsEntries, setStepsEntries] = useState<StepsEntry[]>([]);
  const [alcoholEntries, setAlcoholEntries] = useState<AlcoholEntry[]>([]);
  const [showPersonnage, setShowPersonnage] = useState(false);

  useEffect(() => {
    const storedSessions = localStorage.getItem('skinnybadger_sessions');
    const storedWeight = localStorage.getItem('skinnybadger_weight');
    const storedSteps = localStorage.getItem('skinnybadger_steps');
    const storedAlcohol = localStorage.getItem('skinnybadger_alcohol');

    if (storedSessions) setSessions(JSON.parse(storedSessions));
    if (storedWeight) setWeightEntries(JSON.parse(storedWeight));
    if (storedSteps) setStepsEntries(JSON.parse(storedSteps));
    if (storedAlcohol) setAlcoholEntries(JSON.parse(storedAlcohol));
  }, []);

  const isProgram4Complete = sessions.some(s => s.week === 4 && s.sessionNumber === 2);
  
  const totalSessions = sessions.length;
  const averageScore = sessions.length > 0 
    ? Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length)
    : 0;
  const bestScore = sessions.length > 0 ? Math.max(...sessions.map(s => s.score)) : 0;
  const firstScore = sessions.length > 0 ? sessions[0].score : 0;
  const lastScore = sessions.length > 0 ? sessions[sessions.length - 1].score : 0;
  const progression = firstScore > 0 ? Math.round(((lastScore - firstScore) / firstScore) * 100) : 0;

  const currentWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : 85.5;
  const startWeight = weightEntries.length > 0 ? weightEntries[0].weight : 85.5;
  const weightLoss = startWeight - currentWeight;

  const totalSteps = stepsEntries.reduce((sum, e) => sum + e.steps, 0);
  const averageStepsPerDay = stepsEntries.length > 0 
    ? Math.round(totalSteps / stepsEntries.length)
    : 0;

  const totalAlcohol = alcoholEntries.reduce((sum, e) => sum + e.glasses, 0);
  const averageAlcoholPerDay = alcoholEntries.length > 0
    ? (totalAlcohol / alcoholEntries.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {isProgram4Complete && (
        <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-lg p-6 text-center shadow-lg">
          <h2 className="text-3xl font-bold mb-2 text-white">🎉 Programme terminé !</h2>
          <p className="text-lg mb-4 text-white">Félicitations pour avoir complété les 4 semaines !</p>
          <button
            onClick={() => setShowPersonnage(!showPersonnage)}
            className="bg-white text-orange-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-md"
          >
            {showPersonnage ? 'Masquer' : 'Voir mon badge'} 🏆
          </button>
          {showPersonnage && (
            <div className="mt-4">
              <Image
                src="/Honeybadger personnage.png"
                alt="Badge de réussite"
                width={200}
                height={200}
                className="mx-auto"
              />
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">📊 Statistiques Entraînement</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-sm text-gray-600 mb-1">Séances totales</div>
            <div className="text-3xl font-bold text-orange-600">{totalSessions}</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-sm text-gray-600 mb-1">Score moyen Bloc A</div>
            <div className="text-3xl font-bold text-orange-600">{averageScore}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-sm text-gray-600 mb-1">Meilleur score</div>
            <div className="text-3xl font-bold text-green-600">{bestScore}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Progression</div>
            <div className="text-3xl font-bold text-blue-600">
              {progression > 0 ? '+' : ''}{progression}%
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">⚖️ Statistiques Poids</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-sm text-gray-600 mb-1">Poids de départ</div>
            <div className="text-3xl font-bold text-purple-600">{startWeight} kg</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-sm text-gray-600 mb-1">Poids actuel</div>
            <div className="text-3xl font-bold text-purple-600">{currentWeight} kg</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 col-span-2">
            <div className="text-sm text-gray-600 mb-1">Perte de poids</div>
            <div className="text-3xl font-bold text-green-600">
              {weightLoss > 0 ? '-' : '+'}{Math.abs(weightLoss).toFixed(1)} kg
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">👟 Statistiques Pas</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Total des pas</div>
            <div className="text-3xl font-bold text-blue-600">{totalSteps.toLocaleString()}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Moyenne / jour</div>
            <div className="text-3xl font-bold text-blue-600">{averageStepsPerDay.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">🍷 Statistiques Alcool</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-sm text-gray-600 mb-1">Total verres</div>
            <div className="text-3xl font-bold text-purple-600">{totalAlcohol}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-sm text-gray-600 mb-1">Moyenne / jour</div>
            <div className="text-3xl font-bold text-purple-600">{averageAlcoholPerDay}</div>
          </div>
        </div>
      </div>

      {sessions.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">🏆 Records personnels</h2>
          <div className="space-y-3">
            {sessions.map((session, idx) => {
              const isPR = session.score === bestScore;
              if (!isPR) return null;
              return (
                <div key={session.id} className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-400">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-lg text-gray-900">
                        Semaine {session.week}, Séance {session.sessionNumber}
                      </div>
                      <div className="text-sm text-gray-600">{session.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-yellow-600">🏆 {session.score}</div>
                      <div className="text-xs text-gray-600">Record personnel</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {sessions.length === 0 && weightEntries.length === 0 && stepsEntries.length === 0 && (
        <div className="bg-white rounded-lg p-12 text-center shadow-md border border-gray-200">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune donnée disponible</h3>
          <p className="text-gray-600">
            Commencez à enregistrer vos séances et vos métriques pour voir vos statistiques ici !
          </p>
        </div>
      )}
    </div>
  );
}
