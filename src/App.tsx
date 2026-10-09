import React, { useState, useEffect } from 'react';
import { GameView, Question, RoundRecord } from './types/game';
import { INITIAL_QUESTIONS } from './data/initialQuestions';
import { LiveGameView } from './components/LiveGameView';
import { ScoreboardView } from './components/ScoreboardView';
import { QuestionBankView } from './components/QuestionBankView';
import { HowToPlayView } from './components/HowToPlayView';
import { ResilientImage } from './components/ResilientImage';
import { playGameSound } from './utils/sound';
import {
  Play,
  Trophy,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

import gatoAvatarImg from './assets/images/wedding_avatar_gato_maia_jumpsuit_1791582630686.jpg';
import humanoAvatarImg from './assets/images/wedding_avatar_humano_peio_clean_1791582312093.jpg';

const STORAGE_KEYS = {
  QUESTIONS: 'maia_peio_questions_v3',
  HISTORY: 'maia_peio_history_v2',
  BONUS_GATO: 'maia_peio_bonus_gato_v2',
  BONUS_HUMANO: 'maia_peio_bonus_humano_v2',
  CURRENT_INDEX: 'maia_peio_current_idx_v2',
};

export default function App() {
  const [view, setView] = useState<GameView>('TITLE_MENU');
  const [muted, setMuted] = useState<boolean>(false);
  const [confirmResetGame, setConfirmResetGame] = useState<boolean>(false);

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to default questions
    }
    return INITIAL_QUESTIONS;
  });

  const [history, setHistory] = useState<RoundRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [bonusGato, setBonusGato] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BONUS_GATO);
    return saved ? Number(saved) || 0 : 0;
  });

  const [bonusHumano, setBonusHumano] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BONUS_HUMANO);
    return saved ? Number(saved) || 0 : 0;
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_INDEX);
    return saved ? Number(saved) || 0 : 0;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    } catch {}
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch {}
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BONUS_GATO, String(bonusGato));
    } catch {}
  }, [bonusGato]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BONUS_HUMANO, String(bonusHumano));
    } catch {}
  }, [bonusHumano]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.CURRENT_INDEX,
        String(currentQuestionIndex)
      );
    } catch {}
  }, [currentQuestionIndex]);

  const totalGatoScore =
    history.reduce((acc, r) => acc + r.pointsGato, 0) + bonusGato;
  const totalHumanoScore =
    history.reduce((acc, r) => acc + r.pointsHumano, 0) + bonusHumano;

  const completedQuestionIds = new Set(history.map((r) => r.questionId));

  const handleRecordRound = (record: RoundRecord) => {
    setHistory((prev) => {
      const exists = prev.some((r) => r.questionId === record.questionId);
      if (exists) {
        return prev.map((r) =>
          r.questionId === record.questionId ? record : r
        );
      }
      return [...prev, record];
    });
  };

  const handleRemoveHistoryItem = (questionId: string) => {
    setHistory((prev) => prev.filter((r) => r.questionId !== questionId));
  };

  const handleAdjustBonus = (team: 'GATO' | 'HUMANO', delta: number) => {
    playGameSound('select', muted);
    if (team === 'GATO') {
      setBonusGato((prev) => prev + delta);
    } else {
      setBonusHumano((prev) => prev + delta);
    }
  };

  const handleToggleQuestionHasOptions = (questionId: string) => {
    playGameSound('select', muted);
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, hasOptions: !q.hasOptions } : q
      )
    );
  };

  const handleResetGameScores = () => {
    playGameSound('question', muted);
    setHistory([]);
    setBonusGato(0);
    setBonusHumano(0);
    setCurrentQuestionIndex(0);
    setConfirmResetGame(false);
    setView('PLAYING');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-zinc-100">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-zinc-800/90 bg-[#09090B]/95 sticky top-0 z-30">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => setView('TITLE_MENU')}
          className="text-xl font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0 hover:text-zinc-300 transition-colors"
        >
          Maia &amp; Peio · Wedding Edition
        </button>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <button
            type="button"
            onClick={() => setView('PLAYING')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              view === 'PLAYING'
                ? 'text-white border-b-2 border-zinc-200'
                : 'hover:text-white'
            }`}
          >
            Juego en Vivo
          </button>
          <button
            type="button"
            onClick={() => setView('SCOREBOARD')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              view === 'SCOREBOARD'
                ? 'text-white border-b-2 border-zinc-200'
                : 'hover:text-white'
            }`}
          >
            Tabla de Posiciones
          </button>
          <button
            type="button"
            onClick={() => setView('QUESTION_BANK')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              view === 'QUESTION_BANK'
                ? 'text-white border-b-2 border-zinc-200'
                : 'hover:text-white'
            }`}
          >
            Banco de Preguntas
          </button>
          <button
            type="button"
            onClick={() => setView('HOW_TO_PLAY')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              view === 'HOW_TO_PLAY'
                ? 'text-white border-b-2 border-zinc-200'
                : 'hover:text-white'
            }`}
          >
            Reglas
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              playGameSound('question', muted);
              setView(view === 'PLAYING' ? 'SCOREBOARD' : 'PLAYING');
            }}
            className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-gradient-to-b from-white via-zinc-200 to-zinc-300 rounded-lg hover:from-white hover:to-zinc-200 transition-colors whitespace-nowrap shrink-0"
          >
            {view === 'PLAYING' ? 'Ver Posiciones' : 'Jugar Ahora'}
          </button>
        </div>
      </header>

      {/* Mobile Secondary Navigation Strip (Visible only on small screens) */}
      <div className="flex md:hidden items-center justify-around gap-2 px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-xs font-medium">
        <button
          type="button"
          onClick={() => setView('PLAYING')}
          className={`whitespace-nowrap shrink-0 ${
            view === 'PLAYING' ? 'text-white font-semibold' : 'text-zinc-400'
          }`}
        >
          Juego
        </button>
        <button
          type="button"
          onClick={() => setView('SCOREBOARD')}
          className={`whitespace-nowrap shrink-0 ${
            view === 'SCOREBOARD'
              ? 'text-white font-semibold'
              : 'text-zinc-400'
          }`}
        >
          Posiciones ({totalGatoScore}-{totalHumanoScore})
        </button>
        <button
          type="button"
          onClick={() => setView('QUESTION_BANK')}
          className={`whitespace-nowrap shrink-0 ${
            view === 'QUESTION_BANK'
              ? 'text-white font-semibold'
              : 'text-zinc-400'
          }`}
        >
          Preguntas ({questions.length})
        </button>
        <button
          type="button"
          onClick={() => setView('HOW_TO_PLAY')}
          className={`whitespace-nowrap shrink-0 ${
            view === 'HOW_TO_PLAY'
              ? 'text-white font-semibold'
              : 'text-zinc-400'
          }`}
        >
          Reglas
        </button>
      </div>

      {/* Main Content View Router */}
      <main className="flex-1">
        {view === 'TITLE_MENU' && (
          <section className="max-w-6xl mx-auto px-6 py-10">
            {/* 2-Column Black & Silver Wedding Hero Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
              <div className="lg:col-span-7 flex flex-col justify-between p-8 bg-zinc-900/95 border border-zinc-700/80 rounded-2xl">
                <div>
                  <p className="text-xs text-zinc-400 mb-3">
                    Despedida de Soltera · Edición Nupcial Black &amp; Silver
                  </p>
                  <h1 className="text-4xl sm:text-6xl font-bold text-white font-display leading-tight">
                    Maia &amp; Peio: Gatos vs. Humanos
                  </h1>
                  <p className="text-base text-zinc-300 mt-4 leading-relaxed max-w-2xl">
                    Los invitados se dividen entre el{' '}
                    <strong className="text-white font-semibold">
                      Team Gato (Maia)
                    </strong>{' '}
                    y el{' '}
                    <strong className="text-white font-semibold">
                      Team Humano (Peio)
                    </strong>
                    . En cada pregunta,{' '}
                    <strong className="text-white font-semibold">
                      ambos equipos contestan
                    </strong>{' '}
                    intentando acertar la respuesta, mientras tanto Maia como Peio escriben la respuesta correcta en un papel.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      playGameSound('question', muted);
                      setView('PLAYING');
                    }}
                    className="px-6 py-3 text-sm font-semibold text-zinc-950 bg-gradient-to-b from-white via-zinc-200 to-zinc-300 rounded-xl hover:from-white hover:to-zinc-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    {history.length > 0
                      ? `Continuar Partida (Pregunta ${currentQuestionIndex + 1})`
                      : 'Empezar el Juego de la Despedida'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setView('QUESTION_BANK')}
                    className="px-5 py-3 text-sm font-medium text-zinc-200 bg-zinc-950 border border-zinc-700 rounded-xl hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0"
                  >
                    Ver o Editar las {questions.length} Preguntas
                  </button>

                  <button
                    type="button"
                    onClick={() => setMuted((prev) => !prev)}
                    className="px-4 py-3 text-xs font-medium text-zinc-300 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
                  >
                    {muted ? (
                      <>
                        <VolumeX className="w-4 h-4 text-zinc-400" />
                        Sonido Silenciado
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-zinc-200" />
                        Efectos Activos
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Dual Portrait Wedding Showcase Card: Maia (Team Gato) & Peio (Team Humano) */}
              <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-zinc-700/80 bg-zinc-900 grid grid-cols-2 divide-x divide-zinc-700/80">
                <div className="relative flex flex-col justify-end min-h-[280px]">
                  <ResilientImage
                    src={gatoAvatarImg}
                    alt="Maia - Team Gato"
                    fallbackType="gato"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4">
                    <span className="text-[11px] text-zinc-300">
                      Team Maia
                    </span>
                    <span className="text-lg font-bold text-white font-display">
                      Team Gato
                    </span>
                  </div>
                </div>

                <div className="relative flex flex-col justify-end min-h-[280px]">
                  <ResilientImage
                    src={humanoAvatarImg}
                    alt="Peio - Team Humano"
                    fallbackType="humano"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4">
                    <span className="text-[11px] text-zinc-300">
                      Team Peio
                    </span>
                    <span className="text-lg font-bold text-white font-display">
                      Team Humano
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-Width 3-Card Wedding Rules & Team Score Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-zinc-900/90 border border-zinc-700/80 rounded-xl flex items-center gap-4">
                <ResilientImage
                  src={gatoAvatarImg}
                  alt="Avatar Team Gato"
                  fallbackType="gato"
                  className="w-20 h-20 rounded-xl object-cover border border-zinc-500/50 shrink-0"
                />
                <div>
                  <p className="text-xs text-zinc-400 font-medium">
                    Team Maia
                  </p>
                  <h2 className="text-2xl font-bold text-white font-display">
                    Team Gato
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Instinto felino, copas de vino y fanatismo por los michis.
                  </p>
                  <p className="text-sm font-mono tabular-nums text-white font-semibold mt-2">
                    Puntaje: {totalGatoScore} pts
                  </p>
                </div>
              </div>

              <div className="p-6 bg-zinc-900/90 border border-zinc-700/80 rounded-xl flex items-center gap-4">
                <ResilientImage
                  src={humanoAvatarImg}
                  alt="Avatar Team Humano"
                  fallbackType="humano"
                  className="w-20 h-20 rounded-xl object-cover border border-zinc-500/50 shrink-0"
                />
                <div>
                  <p className="text-xs text-zinc-400 font-medium">
                    Team Peio (Pedro)
                  </p>
                  <h2 className="text-2xl font-bold text-white font-display">
                    Team Humano
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Espíritu outdoor, Patagonia y alergia total a &ldquo;Volare&rdquo;.
                  </p>
                  <p className="text-sm font-mono tabular-nums text-zinc-200 font-semibold mt-2">
                    Puntaje: {totalHumanoScore} pts
                  </p>
                </div>
              </div>

              <div className="p-6 bg-zinc-900/90 border border-zinc-700/80 rounded-xl flex flex-col justify-between">
                <div>
                  <p className="text-xs text-zinc-400 font-medium">
                    Dinámica del Papel Nupcial
                  </p>
                  <h2 className="text-2xl font-bold text-white font-display mt-0.5">
                    Ambos Contestan · Ellos Deciden
                  </h2>
                  <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                    Team Gato y Team Humano contestan. Si Maia y Peio no coinciden en su papel, no hay respuesta correcta. Si coinciden, suma quien haya acertado (alguno, ambos o ninguno).
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono tabular-nums text-zinc-400">
                  <span>{questions.length} preguntas listas</span>
                  <span>{history.length} rondas jugadas</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {view === 'PLAYING' && (
          <LiveGameView
            questions={questions}
            currentIndex={currentQuestionIndex}
            gatoAvatar={gatoAvatarImg}
            humanoAvatar={humanoAvatarImg}
            totalGatoScore={totalGatoScore}
            totalHumanoScore={totalHumanoScore}
            history={history}
            muted={muted}
            onSelectQuestionIndex={(idx) => setCurrentQuestionIndex(idx)}
            onToggleQuestionHasOptions={handleToggleQuestionHasOptions}
            onRecordRound={handleRecordRound}
            onFinishGame={() => setView('GAME_OVER')}
          />
        )}

        {view === 'SCOREBOARD' && (
          <ScoreboardView
            gatoAvatar={gatoAvatarImg}
            humanoAvatar={humanoAvatarImg}
            history={history}
            bonusGato={bonusGato}
            bonusHumano={bonusHumano}
            onAdjustBonus={handleAdjustBonus}
            onRemoveHistoryItem={handleRemoveHistoryItem}
            onReturnToGame={() => setView('PLAYING')}
          />
        )}

        {view === 'QUESTION_BANK' && (
          <QuestionBankView
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            completedQuestionIds={completedQuestionIds}
            onUpdateQuestions={setQuestions}
            onResetDefaultQuestions={() => {
              setQuestions(INITIAL_QUESTIONS);
              setCurrentQuestionIndex(0);
            }}
            onJumpToQuestion={(idx) => {
              setCurrentQuestionIndex(idx);
              setView('PLAYING');
            }}
          />
        )}

        {view === 'HOW_TO_PLAY' && (
          <HowToPlayView onStartPlaying={() => setView('PLAYING')} />
        )}

        {view === 'GAME_OVER' && (
          <section className="max-w-4xl mx-auto px-6 py-12 text-center">
            <div className="p-8 sm:p-10 bg-zinc-900 border border-zinc-700/80 rounded-2xl">
              <Trophy className="w-14 h-14 text-zinc-200 mx-auto mb-4" />
              <p className="text-xs text-zinc-400 font-mono tabular-nums mb-2">
                Resultado Final de la Despedida · {history.length} Rondas Jugadas
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold text-white font-display">
                {totalGatoScore > totalHumanoScore
                  ? '¡Victoria para el Team Gato (Maia)!'
                  : totalHumanoScore > totalGatoScore
                  ? '¡Victoria para el Team Humano (Peio)!'
                  : '¡Empate de Gala entre Gatos y Humanos!'}
              </h1>
              <p className="text-base text-zinc-300 mt-3 max-w-xl mx-auto">
                Maia y Peio coincidieron en su papel en{' '}
                <strong className="text-white font-mono">
                  {history.filter((r) => r.coupleMatched).length}
                </strong>{' '}
                de las{' '}
                <strong className="text-white font-mono">
                  {history.length}
                </strong>{' '}
                preguntas respondidas.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 text-left">
                <div className="p-6 bg-zinc-950 border border-zinc-600 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <ResilientImage
                      src={gatoAvatarImg}
                      alt="Team Gato"
                      fallbackType="gato"
                      className="w-14 h-14 rounded-xl object-cover border border-zinc-500/50 shrink-0"
                    />
                    <div>
                      <p className="text-xs text-zinc-400">
                        Team Maia
                      </p>
                      <h2 className="text-2xl font-bold text-white font-display">
                        Team Gato
                      </h2>
                    </div>
                  </div>
                  <span className="text-4xl font-bold text-white font-mono tabular-nums">
                    {totalGatoScore}
                  </span>
                </div>

                <div className="p-6 bg-zinc-950 border border-zinc-600 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <ResilientImage
                      src={humanoAvatarImg}
                      alt="Team Humano"
                      fallbackType="humano"
                      className="w-14 h-14 rounded-xl object-cover border border-zinc-500/50 shrink-0"
                    />
                    <div>
                      <p className="text-xs text-zinc-400">
                        Team Peio
                      </p>
                      <h2 className="text-2xl font-bold text-white font-display">
                        Team Humano
                      </h2>
                    </div>
                  </div>
                  <span className="text-4xl font-bold text-zinc-200 font-mono tabular-nums">
                    {totalHumanoScore}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setView('SCOREBOARD')}
                  className="px-5 py-2.5 text-xs font-semibold text-zinc-950 bg-gradient-to-b from-white via-zinc-200 to-zinc-300 rounded-lg hover:from-white hover:to-zinc-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Ver Detalle de Rondas y Posiciones
                </button>
                <button
                  type="button"
                  onClick={handleResetGameScores}
                  className="px-5 py-2.5 text-xs font-medium text-zinc-200 bg-zinc-950 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Empezar Nueva Partida desde Cero
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Quiet Footer with Real Host Controls */}
      <footer className="border-t border-zinc-800/80 px-6 py-4 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <span>
            Despedida de Soltera de Maia &amp; Peio · Edición Boda Black &amp; Silver
          </span>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMuted((prev) => !prev)}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {muted ? 'Activar Sonido' : 'Silenciar Sonido'}
            </button>

            <span aria-hidden="true">·</span>

            {!confirmResetGame ? (
              <button
                type="button"
                onClick={() => setConfirmResetGame(true)}
                className="hover:text-rose-400 transition-colors whitespace-nowrap shrink-0"
              >
                Reiniciar Puntajes
              </button>
            ) : (
              <span className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetGameScores}
                  className="text-rose-400 font-semibold hover:underline whitespace-nowrap shrink-0"
                >
                  Confirmar reinicio a 0
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmResetGame(false)}
                  className="text-zinc-300 hover:underline whitespace-nowrap shrink-0"
                >
                  Cancelar
                </button>
              </span>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
