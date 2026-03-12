'use client';

import { useState, useEffect } from 'react';

interface Exercise {
  name: string;
  sets: number[];
}

interface Session {
  id: string;
  date: string;
  week: number;
  sessionNumber: number;
  blocA: Exercise[];
  blocB: Exercise[];
  score: number;
  isExpress: boolean;
}

const TARGETS = {
  1: { pompes: [3, 6] as [number, number], cossack: [5, 6] as [number, number], deadbug: [3, 5] as [number, number] },
  2: { pompes: [4, 7] as [number, number], cossack: [6, 7] as [number, number], deadbug: [4, 6] as [number, number] },
  3: { pompes: [5, 8] as [number, number], cossack: [7, 8] as [number, number], deadbug: [5, 7] as [number, number] },
  4: { pompes: [6, 9] as [number, number], cossack: [8, 9] as [number, number], deadbug: [6, 8] as [number, number] },
};

const YOUTUBE_LINKS = {
  'Cossack squat': 'https://www.youtube.com/watch?v=JaCbmoDqUc4',
  'Dead bug': 'https://www.youtube.com/watch?v=g_BYB0R-4Ws',
  'Pompes': 'https://www.youtube.com/watch?v=IODxDxX7oi4',
};

export default function WorkoutTab() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [week, setWeek] = useState(1);
  const [sessionNumber, setSessionNumber] = useState(1);
  const [isExpress, setIsExpress] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  const [pompes, setPompes] = useState(['', '', '']);
  const [cossack, setCossack] = useState(['', '', '']);
  const [deadbug, setDeadbug] = useState(['', '', '']);
  const [goblet, setGoblet] = useState(['', '', '']);
  const [row, setRow] = useState(['', '', '']);
  const [halo, setHalo] = useState(['', '', '']);

  useEffect(() => {
    const stored = localStorage.getItem('skinnybadger_sessions');
    if (stored) {
      setSessions(JSON.parse(stored));
    }
  }, []);

  const calculateScore = (pompes: string[], cossack: string[], deadbug: string[]) => {
    const pompesTotal = pompes.reduce((sum, val) => sum + (parseInt(val) || 0), 0);
    const cossackTotal = cossack.reduce((sum, val) => sum + (parseInt(val) || 0), 0);
    const deadbugTotal = deadbug.reduce((sum, val) => sum + (parseInt(val) || 0), 0);
    return pompesTotal + cossackTotal + deadbugTotal;
  };

  const getIndicator = (total: number, exerciseName: string, week: number) => {
    const targets = TARGETS[week as keyof typeof TARGETS];
    let range: [number, number] = [0, 0];
    
    if (exerciseName === 'Pompes') range = targets.pompes;
    else if (exerciseName === 'Cossack squat') range = targets.cossack;
    else if (exerciseName === 'Dead bug') range = targets.deadbug;

    const totalTarget = range[0] * 3;
    const totalMax = range[1] * 3;

    if (total < totalTarget) return '🔽';
    if (total > totalMax) return '🔼';
    return '✅';
  };

  const handleSubmit = () => {
    const blocA: Exercise[] = [
      { name: 'Pompes', sets: pompes.map(v => parseInt(v) || 0) },
      { name: 'Cossack squat', sets: cossack.map(v => parseInt(v) || 0) },
      { name: 'Dead bug', sets: deadbug.map(v => parseInt(v) || 0) },
    ];

    const blocB: Exercise[] = isExpress ? [] : [
      { name: 'Goblet squat', sets: goblet.map(v => parseInt(v) || 0) },
      { name: 'Row unilatéral KB', sets: row.map(v => parseInt(v) || 0) },
      { name: 'KB Halo', sets: halo.map(v => parseInt(v) || 0) },
    ];

    const score = calculateScore(pompes, cossack, deadbug);

    const newSession: Session = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('fr-FR'),
      week,
      sessionNumber,
      blocA,
      blocB,
      score,
      isExpress,
    };

    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    localStorage.setItem('skinnybadger_sessions', JSON.stringify(updatedSessions));

    setPompes(['', '', '']);
    setCossack(['', '', '']);
    setDeadbug(['', '', '']);
    setGoblet(['', '', '']);
    setRow(['', '', '']);
    setHalo(['', '', '']);
    setIsExpress(false);
    
    alert(`Séance enregistrée ! Score Bloc A : ${score}`);
  };

  const renderSetInputs = (values: string[], setter: (vals: string[]) => void, label: string) => (
    <div className="mb-3 sm:mb-4">
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <label className="font-semibold text-sm sm:text-lg">{label}</label>
        {YOUTUBE_LINKS[label as keyof typeof YOUTUBE_LINKS] && (
          <a
            href={YOUTUBE_LINKS[label as keyof typeof YOUTUBE_LINKS]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 text-xs sm:text-sm hover:text-orange-600"
          >
            📺 Technique
          </a>
        )}
      </div>
      <div className="flex gap-1 sm:gap-2">
        {values.map((val, idx) => (
          <input
            key={idx}
            type="number"
            inputMode="numeric"
            placeholder={`S${idx + 1}`}
            value={val}
            onChange={(e) => {
              const newVals = [...values];
              newVals[idx] = e.target.value;
              setter(newVals);
            }}
            className="flex-1 bg-white border-2 border-gray-300 text-gray-900 px-2 sm:px-4 py-2 sm:py-3 rounded-lg text-center text-lg sm:text-xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        ))}
      </div>
      {label !== 'Goblet squat' && label !== 'Row unilatéral KB' && label !== 'KB Halo' && (
        <div className="mt-1 text-xs sm:text-sm text-gray-600 flex items-center gap-2">
          <span>Total: {values.reduce((sum, v) => sum + (parseInt(v) || 0), 0)}</span>
          <span>{getIndicator(values.reduce((sum, v) => sum + (parseInt(v) || 0), 0), label, week)}</span>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full bg-white border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          {showHistory ? '📝 Nouvelle séance' : '📜 Historique'}
        </button>
      </div>

      {!showHistory ? (
        <div>
          <div className="bg-white rounded-lg p-3 sm:p-6 mb-4 sm:mb-6 shadow-md border border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Nouvelle séance</h2>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Semaine</label>
                <select
                  value={week}
                  onChange={(e) => setWeek(parseInt(e.target.value))}
                  className="w-full bg-white border-2 border-gray-300 text-gray-900 px-2 sm:px-4 py-2 sm:py-3 rounded-lg text-base sm:text-lg font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {[1, 2, 3, 4].map(w => (
                    <option key={w} value={w}>Semaine {w}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Séance</label>
                <select
                  value={sessionNumber}
                  onChange={(e) => setSessionNumber(parseInt(e.target.value))}
                  className="w-full bg-white border-2 border-gray-300 text-gray-900 px-2 sm:px-4 py-2 sm:py-3 rounded-lg text-base sm:text-lg font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value={1}>Séance 1</option>
                  <option value={2}>Séance 2</option>
                </select>
              </div>
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isExpress}
                  onChange={(e) => setIsExpress(e.target.checked)}
                  className="w-4 h-4 sm:w-5 sm:h-5 accent-orange-500"
                />
                <span className="text-sm sm:text-lg">⚡ Séance Express (Bloc A uniquement)</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 sm:p-6 mb-4 sm:mb-6 shadow-md border border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-orange-600">🔥 BLOC A (Score principal)</h3>
            {renderSetInputs(pompes, setPompes, 'Pompes')}
            {renderSetInputs(cossack, setCossack, 'Cossack squat')}
            {renderSetInputs(deadbug, setDeadbug, 'Dead bug')}
            
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Score Bloc A prévu</div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                {calculateScore(pompes, cossack, deadbug)}
              </div>
            </div>
          </div>

          {!isExpress && (
            <div className="bg-white rounded-lg p-3 sm:p-6 mb-4 sm:mb-6 shadow-md border border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-blue-600">💪 BLOC B (Kettlebell 12kg)</h3>
              {renderSetInputs(goblet, setGoblet, 'Goblet squat')}
              {renderSetInputs(row, setRow, 'Row unilatéral KB')}
              {renderSetInputs(halo, setHalo, 'KB Halo')}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-orange-500 text-white py-3 sm:py-4 rounded-lg text-lg sm:text-xl font-bold hover:bg-orange-600 transition shadow-lg"
          >
            ✅ Valider la séance
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Historique des séances</h2>
          
          {sessions.length === 0 ? (
            <div className="bg-white rounded-lg p-6 sm:p-8 text-center text-gray-500 border border-gray-200">
              Aucune séance enregistrée
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {[...sessions].reverse().map((session) => (
                <div key={session.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
                  <div
                    onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                    className="p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-base sm:text-lg">
                          S{session.week}.{session.sessionNumber} {session.isExpress && '⚡'}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">{session.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl sm:text-2xl font-bold text-orange-600">{session.score}</div>
                        <div className="text-xs text-gray-500">Score Bloc A</div>
                      </div>
                    </div>
                  </div>
                  
                  {expandedSession === session.id && (
                    <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
                      <h4 className="font-semibold mb-2 text-sm sm:text-base text-orange-600">Bloc A</h4>
                      {session.blocA.map((ex, idx) => (
                        <div key={idx} className="mb-2 text-xs sm:text-sm">
                          <span className="font-semibold">{ex.name}:</span> {ex.sets.join(' - ')} reps
                        </div>
                      ))}
                      
                      {session.blocB.length > 0 && (
                        <>
                          <h4 className="font-semibold mb-2 mt-3 sm:mt-4 text-sm sm:text-base text-blue-600">Bloc B</h4>
                          {session.blocB.map((ex, idx) => (
                            <div key={idx} className="mb-2 text-xs sm:text-sm">
                              <span className="font-semibold">{ex.name}:</span> {ex.sets.join(' - ')} reps
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
