import React from 'react';
import { RoundRecord } from '../types/game';
import { ResilientImage } from './ResilientImage';
import { Plus, Minus, Trash2, Trophy, Play } from 'lucide-react';

interface ScoreboardViewProps {
  gatoAvatar: string;
  humanoAvatar: string;
  history: RoundRecord[];
  bonusGato: number;
  bonusHumano: number;
  onAdjustBonus: (team: 'GATO' | 'HUMANO', delta: number) => void;
  onRemoveHistoryItem: (questionId: string) => void;
  onReturnToGame: () => void;
}

export const ScoreboardView: React.FC<ScoreboardViewProps> = ({
  gatoAvatar,
  humanoAvatar,
  history,
  bonusGato,
  bonusHumano,
  onAdjustBonus,
  onRemoveHistoryItem,
  onReturnToGame,
}) => {
  const roundsGatoPoints = history.reduce((acc, r) => acc + r.pointsGato, 0);
  const roundsHumanoPoints = history.reduce((acc, r) => acc + r.pointsHumano, 0);

  const totalGato = roundsGatoPoints + bonusGato;
  const totalHumano = roundsHumanoPoints + bonusHumano;

  const matchedCount = history.filter((r) => r.coupleMatched).length;
  const mismatchedCount = history.filter((r) => !r.coupleMatched).length;
  const matchRate =
    history.length > 0 ? Math.round((matchedCount / history.length) * 100) : 0;

  const leaderText =
    totalGato > totalHumano
      ? 'Lidera Team Gato (Maia)'
      : totalHumano > totalGato
      ? 'Lidera Team Humano (Peio)'
      : 'Empate entre Gatos y Humanos';

  return (
    <section className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800">
        <div>
          <p className="text-xs text-zinc-400 mb-2 font-mono tabular-nums">
            Tabla Oficial de la Despedida · {history.length} rondas registradas · {leaderText}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-display">
            Tabla de Posiciones: Gatos vs. Humanos
          </h1>
        </div>
        <button
          type="button"
          onClick={onReturnToGame}
          className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-gradient-to-b from-white via-zinc-200 to-zinc-300 rounded-lg hover:from-white hover:to-zinc-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <Play className="w-3.5 h-3.5" />
          Volver a las Preguntas
        </button>
      </div>

      {/* Team Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {/* Team Gato (Maia) */}
        <div className="p-6 bg-zinc-900/95 border border-zinc-700/80 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ResilientImage
                src={gatoAvatar}
                alt="Team Gato (Maia)"
                fallbackType="gato"
                className="w-16 h-16 rounded-xl object-cover border border-zinc-400/50 shrink-0"
              />
              <div>
                <p className="text-xs text-zinc-400 font-medium">
                  Team Maia
                </p>
                <h2 className="text-2xl font-bold text-white font-display">
                  Team Gato
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5 font-mono tabular-nums">
                  {roundsGatoPoints} pts por preguntas · {bonusGato >= 0 ? `+${bonusGato}` : bonusGato} pts extra
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-5xl font-bold text-white font-mono tabular-nums">
                {totalGato}
              </span>
              <span className="block text-xs text-zinc-400 mt-1">puntos totales</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-5 mt-5 border-t border-zinc-800">
            <span className="text-xs text-zinc-400">
              Ajuste manual (prendas / desempate en vivo):
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onAdjustBonus('GATO', -1)}
                className="px-2.5 py-1.5 text-xs font-mono font-medium text-zinc-300 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <Minus className="w-3.5 h-3.5" /> 1 pt
              </button>
              <button
                type="button"
                onClick={() => onAdjustBonus('GATO', 1)}
                className="px-2.5 py-1.5 text-xs font-mono font-medium text-zinc-950 bg-zinc-200 rounded-lg hover:bg-white transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> 1 pt
              </button>
            </div>
          </div>
        </div>

        {/* Team Humano (Peio) */}
        <div className="p-6 bg-zinc-900/95 border border-zinc-700/80 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ResilientImage
                src={humanoAvatar}
                alt="Team Humano (Peio)"
                fallbackType="humano"
                className="w-16 h-16 rounded-xl object-cover border border-zinc-400/50 shrink-0"
              />
              <div>
                <p className="text-xs text-zinc-400 font-medium">
                  Team Peio (Pedro)
                </p>
                <h2 className="text-2xl font-bold text-white font-display">
                  Team Humano
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5 font-mono tabular-nums">
                  {roundsHumanoPoints} pts por preguntas · {bonusHumano >= 0 ? `+${bonusHumano}` : bonusHumano} pts extra
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-5xl font-bold text-zinc-200 font-mono tabular-nums">
                {totalHumano}
              </span>
              <span className="block text-xs text-zinc-400 mt-1">puntos totales</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-5 mt-5 border-t border-zinc-800">
            <span className="text-xs text-zinc-400">
              Ajuste manual (prendas / desempate en vivo):
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onAdjustBonus('HUMANO', -1)}
                className="px-2.5 py-1.5 text-xs font-mono font-medium text-zinc-300 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <Minus className="w-3.5 h-3.5" /> 1 pt
              </button>
              <button
                type="button"
                onClick={() => onAdjustBonus('HUMANO', 1)}
                className="px-2.5 py-1.5 text-xs font-mono font-medium text-zinc-950 bg-zinc-200 rounded-lg hover:bg-white transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> 1 pt
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Couple Coincidence Summary Strip */}
      <div className="p-6 bg-zinc-900/80 border border-zinc-800 rounded-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-zinc-400">
              Estadística Nupcial en el Papel
            </p>
            <h3 className="text-xl font-bold text-white font-display mt-0.5">
              Nivel de Coincidencia entre Maia &amp; Peio
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Cada vez que ambos escriben la misma respuesta en su papel, habilitan los puntos para los equipos que hayan acertado.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono tabular-nums">
            <div>
              <span className="block text-2xl font-bold text-white">
                {matchedCount}
              </span>
              <span className="text-xs text-zinc-400 font-sans">
                Coincidieron
              </span>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div>
              <span className="block text-2xl font-bold text-zinc-400">
                {mismatchedCount}
              </span>
              <span className="text-xs text-zinc-400 font-sans">
                No coincidieron
              </span>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div>
              <span className="block text-2xl font-bold text-zinc-200">
                {matchRate}%
              </span>
              <span className="text-xs text-zinc-400 font-sans">
                Sintonía en papel
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Round by Round History Table */}
      <div>
        <h3 className="text-xl font-bold text-white font-display mb-4">
          Historial de Rondas Jugadas
        </h3>

        {history.length === 0 ? (
          <div className="p-10 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
            <Trophy className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-zinc-300">
              Todavía no se resolvió ninguna pregunta
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Cuando vayas jugando las preguntas y registrando si Maia y Peio coincidieron en su papel, cada ronda aparecerá acá.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-xs text-zinc-400">
                  <th className="py-3.5 px-4 font-medium">#</th>
                  <th className="py-3.5 px-4 font-medium">Pregunta</th>
                  <th className="py-3.5 px-4 font-medium">Respuestas de Ambos Equipos</th>
                  <th className="py-3.5 px-4 font-medium">Papel Maia &amp; Peio</th>
                  <th className="py-3.5 px-4 font-medium">Resultado</th>
                  <th className="py-3.5 px-4 font-medium text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/70 text-sm">
                {history.map((item) => {
                  let winnerLabel = 'Sin puntos (0)';
                  if (!item.coupleMatched) {
                    winnerLabel = 'Inconclusa (Novios no coincidieron)';
                  } else if (item.winner === 'GATO') {
                    winnerLabel = '+1 pt Team Gato (Maia)';
                  } else if (item.winner === 'HUMANO') {
                    winnerLabel = '+1 pt Team Humano (Peio)';
                  } else if (item.winner === 'BOTH') {
                    winnerLabel = '+1 pt Ambos Equipos';
                  } else {
                    winnerLabel = '0 pts (Ningún equipo acertó)';
                  }

                  return (
                    <tr key={item.questionId} className="hover:bg-zinc-800/40">
                      <td className="py-3.5 px-4 font-mono tabular-nums text-xs text-zinc-200 font-semibold">
                        {String(item.questionNumber).padStart(2, '0')}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-medium text-zinc-100 line-clamp-2">
                          {item.questionPrompt}
                        </p>
                        <span className="text-xs text-zinc-400">{item.category}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-zinc-300 space-y-1">
                        <div>
                          <span className="text-white font-semibold">Gato: </span>
                          <span>{item.gatoAnswerText || '—'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-300 font-semibold">Humano: </span>
                          <span>{item.humanoAnswerText || '—'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        {item.coupleMatched ? (
                          <span className="text-emerald-300 font-medium">
                            Coincidieron
                          </span>
                        ) : (
                          <span className="text-rose-300 font-medium">
                            No coincidieron
                          </span>
                        )}
                        {item.couplePaperNote && (
                          <p className="text-zinc-400 mt-0.5">
                            &ldquo;{item.couplePaperNote}&rdquo;
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono tabular-nums text-zinc-200">
                        {winnerLabel}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onRemoveHistoryItem(item.questionId)}
                          className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg transition-colors"
                          title="Anular y volver a jugar esta ronda"
                          aria-label="Anular resultado de esta pregunta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
