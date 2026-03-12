'use client';

import { useState, useEffect } from 'react';

interface WeightEntry {
  id: string;
  date: string;
  week: number;
  weight: number;
}

interface StepsEntry {
  id: string;
  date: string;
  steps: number;
}

interface AlcoholEntry {
  id: string;
  date: string;
  glasses: number;
}

interface Session {
  id: string;
  date: string;
  week: number;
  sessionNumber: number;
  blocA: { name: string; sets: number[] }[];
  score: number;
}

export default function TrackingTab() {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [stepsEntries, setStepsEntries] = useState<StepsEntry[]>([]);
  const [alcoholEntries, setAlcoholEntries] = useState<AlcoholEntry[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  const [currentWeight, setCurrentWeight] = useState('');
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentSteps, setCurrentSteps] = useState('');
  const [currentGlasses, setCurrentGlasses] = useState('');

  useEffect(() => {
    const storedWeight = localStorage.getItem('skinnybadger_weight');
    const storedSteps = localStorage.getItem('skinnybadger_steps');
    const storedAlcohol = localStorage.getItem('skinnybadger_alcohol');
    const storedSessions = localStorage.getItem('skinnybadger_sessions');

    if (storedWeight) setWeightEntries(JSON.parse(storedWeight));
    if (storedSteps) setStepsEntries(JSON.parse(storedSteps));
    if (storedAlcohol) setAlcoholEntries(JSON.parse(storedAlcohol));
    if (storedSessions) setSessions(JSON.parse(storedSessions));
  }, []);

  const addWeight = () => {
    if (!currentWeight) return;

    const newEntry: WeightEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('fr-FR'),
      week: currentWeek,
      weight: parseFloat(currentWeight),
    };

    const updated = [...weightEntries, newEntry];
    setWeightEntries(updated);
    localStorage.setItem('skinnybadger_weight', JSON.stringify(updated));
    setCurrentWeight('');
    alert('Poids enregistré !');
  };

  const addSteps = () => {
    if (!currentSteps) return;

    const newEntry: StepsEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('fr-FR'),
      steps: parseInt(currentSteps),
    };

    const updated = [...stepsEntries, newEntry];
    setStepsEntries(updated);
    localStorage.setItem('skinnybadger_steps', JSON.stringify(updated));
    setCurrentSteps('');
    alert('Pas enregistrés !');
  };

  const addAlcohol = () => {
    if (!currentGlasses) return;

    const newEntry: AlcoholEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('fr-FR'),
      glasses: parseInt(currentGlasses),
    };

    const updated = [...alcoholEntries, newEntry];
    setAlcoholEntries(updated);
    localStorage.setItem('skinnybadger_alcohol', JSON.stringify(updated));
    setCurrentGlasses('');
    alert('Alcool enregistré !');
  };

  const getWeeklySteps = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return stepsEntries
      .filter(entry => {
        const entryDate = new Date(entry.date.split('/').reverse().join('-'));
        return entryDate >= weekAgo;
      })
      .reduce((sum, entry) => sum + entry.steps, 0);
  };

  const getExerciseData = (exerciseName: string) => {
    return sessions.map(session => {
      const exercise = session.blocA.find(ex => ex.name === exerciseName);
      const total = exercise ? exercise.sets.reduce((sum: number, val: number) => sum + val, 0) : 0;
      return {
        label: `S${session.week}.${session.sessionNumber}`,
        value: total,
      };
    });
  };

  const pompesData = getExerciseData('Pompes');
  const cossackData = getExerciseData('Cossack squat');
  const deadbugData = getExerciseData('Dead bug');

  const maxScore = Math.max(...sessions.map(s => s.score), 1);
  const maxPompes = Math.max(...pompesData.map(d => d.value), 1);
  const maxCossack = Math.max(...cossackData.map(d => d.value), 1);
  const maxDeadbug = Math.max(...deadbugData.map(d => d.value), 1);

  const renderBarChart = (data: { label: string; value: number }[], max: number, color: string) => {
    if (data.length === 0) return <div className="text-gray-500 text-center py-8">Aucune donnée</div>;

    return (
      <div className="flex items-end justify-around h-48 gap-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center">
            <div className="text-xs font-bold mb-1 text-gray-700">{item.value}</div>
            <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '160px' }}>
              <div
                className={`absolute bottom-0 w-full rounded-t ${color}`}
                style={{ height: `${(item.value / max) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderLineChart = (data: { label: string; value: number }[], color: string) => {
    if (data.length === 0) return <div className="text-gray-500 text-center py-8">Aucune donnée</div>;

    const max = Math.max(...data.map(d => d.value));
    const min = Math.min(...data.map(d => d.value));
    const range = max - min || 1;

    return (
      <div className="relative h-48">
        <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="3"
            points={data.map((item, idx) => {
              const x = (idx / (data.length - 1)) * 400;
              const y = 200 - ((item.value - min) / range) * 180;
              return `${x},${y}`;
            }).join(' ')}
          />
          {data.map((item, idx) => {
            const x = (idx / (data.length - 1)) * 400;
            const y = 200 - ((item.value - min) / range) * 180;
            return <circle key={idx} cx={x} cy={y} r="4" fill={color} />;
          })}
        </svg>
        <div className="flex justify-around mt-2">
          {data.map((item, idx) => (
            <div key={idx} className="text-xs text-gray-600 text-center">
              <div className="font-bold">{item.value}</div>
              <div>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const weeklySteps = getWeeklySteps();
  const stepsGoalReached = weeklySteps >= 25000;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          ⚖️ Poids hebdomadaire
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">Semaine</label>
          <select
            value={currentWeek}
            onChange={(e) => setCurrentWeek(parseInt(e.target.value))}
            className="w-full bg-white border-2 border-gray-300 text-gray-900 px-4 py-3 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
          >
            {[1, 2, 3, 4].map(w => (
              <option key={w} value={w}>Semaine {w}</option>
            ))}
          </select>

          <label className="block text-sm text-gray-600 mb-2">Poids (kg)</label>
          <input
            type="number"
            step="0.1"
            inputMode="decimal"
            placeholder="85.5"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            className="w-full bg-white border-2 border-gray-300 text-gray-900 px-4 py-3 rounded-lg text-xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <button
          onClick={addWeight}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          ✅ Enregistrer le poids
        </button>

        {weightEntries.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3">📈 Évolution du poids</h3>
            {renderLineChart(
              weightEntries.map(e => ({ label: `S${e.week}`, value: e.weight })),
              '#f97316'
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          👟 Pas quotidiens
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">Nombre de pas aujourd'hui</label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="10000"
            value={currentSteps}
            onChange={(e) => setCurrentSteps(e.target.value)}
            className="w-full bg-white border-2 border-gray-300 text-gray-900 px-4 py-3 rounded-lg text-xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <button
          onClick={addSteps}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          ✅ Enregistrer les pas
        </button>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-gray-600 mb-1">Total cette semaine (7 derniers jours)</div>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-blue-600">{weeklySteps.toLocaleString()}</div>
            <div className="text-4xl">{stepsGoalReached ? '✅' : '❌'}</div>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Objectif : 25 000 pas/semaine
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${stepsGoalReached ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min((weeklySteps / 25000) * 100, 100)}%` }}
            />
          </div>
        </div>

        {stepsEntries.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3">📈 Pas quotidiens (14 derniers jours)</h3>
            {renderLineChart(
              stepsEntries.slice(-14).map(e => ({ 
                label: e.date.split('/').slice(0, 2).join('/'), 
                value: e.steps 
              })),
              '#3b82f6'
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          🍷 Alcool quotidien
        </h2>
        
        <div className="mb-4 p-3 bg-purple-50 rounded border border-purple-200 text-sm text-gray-700">
          <div className="font-semibold mb-1">Équivalences :</div>
          <div>• 12cl de vin = 1 verre</div>
          <div>• 25cl de bière = 1 verre</div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">Nombre de verres aujourd'hui</label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={currentGlasses}
            onChange={(e) => setCurrentGlasses(e.target.value)}
            className="w-full bg-white border-2 border-gray-300 text-gray-900 px-4 py-3 rounded-lg text-xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <button
          onClick={addAlcohol}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          ✅ Enregistrer
        </button>

        {alcoholEntries.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3">📈 Consommation d'alcool (14 derniers jours)</h3>
            {renderBarChart(
              alcoholEntries.slice(-14).map(e => ({ 
                label: e.date.split('/').slice(0, 2).join('/'), 
                value: e.glasses 
              })),
              Math.max(...alcoholEntries.slice(-14).map(e => e.glasses), 1),
              'bg-purple-500'
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">📊 Évolution Score Total Bloc A</h2>
        {renderBarChart(
          sessions.map(s => ({ label: `S${s.week}.${s.sessionNumber}`, value: s.score })),
          maxScore,
          'bg-orange-500'
        )}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">💪 Pompes (total par séance)</h2>
        {renderBarChart(pompesData, maxPompes, 'bg-red-500')}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">🦵 Cossack Squat (total par séance)</h2>
        {renderBarChart(cossackData, maxCossack, 'bg-blue-500')}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">🐛 Dead Bug (total par séance)</h2>
        {renderBarChart(deadbugData, maxDeadbug, 'bg-green-500')}
      </div>
    </div>
  );
}
