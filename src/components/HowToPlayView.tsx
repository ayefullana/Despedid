import React from 'react';
import { Play } from 'lucide-react';

interface HowToPlayViewProps {
  onStartPlaying: () => void;
}

export const HowToPlayView: React.FC<HowToPlayViewProps> = ({ onStartPlaying }) => {
  return (
    <section className="max-w-4xl mx-auto px-6 py-10">
      <div className="pb-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs text-zinc-400 mb-2">
            Reglamento Oficial de la Despedida · Edición Boda Black &amp; Silver
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-display">
            ¿Cómo se juega Gatos vs. Humanos?
          </h1>
        </div>
        <button
          type="button"
          onClick={onStartPlaying}
          className="px-5 py-2.5 text-xs font-semibold text-zinc-950 bg-gradient-to-b from-white via-zinc-200 to-zinc-300 rounded-lg hover:from-white hover:to-zinc-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Ir al Juego en Vivo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div className="p-6 bg-zinc-900/95 border border-zinc-700/80 rounded-xl">
          <p className="text-xs font-mono text-zinc-300 mb-2">
            01. Los Dos Bandos de la Boda
          </p>
          <h2 className="text-2xl font-bold text-white font-display mb-2">
            Team Gato (Maia) vs. Team Humano (Peio)
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Los invitados se dividen entre el{' '}
            <strong className="text-white font-semibold">
              Team Gato (Maia)
            </strong>{' '}
            y el{' '}
            <strong className="text-white font-semibold">
              Team Humano (Peio)
            </strong>
            . Al mismo tiempo, Maia y Peio tienen papel y lapicera en mano.
          </p>
        </div>

        <div className="p-6 bg-zinc-900/95 border border-zinc-700/80 rounded-xl">
          <p className="text-xs font-mono text-zinc-300 mb-2">
            02. Ambos Equipos Contestan
          </p>
          <h2 className="text-2xl font-bold text-white font-display mb-2">
            Respuestas de Equipos y Papel Secreto
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Se muestra la pregunta en pantalla (con opciones o abierta).{' '}
            <strong className="text-white font-semibold">
              Ambos equipos contestan
            </strong>{' '}
            (tanto el Team Gato como el Team Humano dan su respuesta intentando adivinar la verdad), mientras{' '}
            <strong className="text-white font-semibold">
              Maia y Peio escriben la respuesta correcta en su papel
            </strong>
            .
          </p>
        </div>

        <div className="p-6 bg-zinc-900/95 border border-zinc-700/80 rounded-xl">
          <p className="text-xs font-mono text-zinc-400 mb-2">
            03. Opción A: No Coinciden en el Papel
          </p>
          <h2 className="text-2xl font-bold text-white font-display mb-2">
            ¡No sabemos cuál es la respuesta correcta!
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Cuando Maia y Peio dan vuelta sus papeles, si escribieron respuestas distintas,{' '}
            <strong className="text-rose-300 font-semibold">
              no sabemos cuál es la respuesta correcta
            </strong>
            . Nadie suma puntos oficiales en esa pregunta y queda guardada la anécdota.
          </p>
        </div>

        <div className="p-6 bg-zinc-900/95 border border-zinc-700/80 rounded-xl">
          <p className="text-xs font-mono text-zinc-200 mb-2">
            04. Opción B: ¡Maia y Peio Coinciden!
          </p>
          <h2 className="text-2xl font-bold text-white font-display mb-2">
            Se compara con Team Gato y Team Humano
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Si Maia y Peio coinciden en el papel, se ve si esa respuesta coincide con la que dio el{' '}
            <strong className="text-white font-semibold">Team Gato</strong> o el{' '}
            <strong className="text-white font-semibold">Team Humano</strong>. Según quién haya acertado, gana punto{' '}
            <strong className="text-white font-semibold">
              alguno de los equipos, ambos o ninguno
            </strong>
            , sumando en la Tabla de Posiciones.
          </p>
        </div>
      </div>
    </section>
  );
};
