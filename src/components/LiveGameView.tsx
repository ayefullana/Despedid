import React, { useState, useEffect } from 'react';
import {
  Question,
  CoupleMatchState,
  PointWinner,
  RoundRecord,
} from '../types/game';
import { ResilientImage } from './ResilientImage';
import { playGameSound } from '../utils/sound';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Timer,
  CheckCircle2,
  XCircle,
  Trophy,
  ListChecks,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface LiveGameViewProps {
  questions: Question[];
  currentIndex: number;
  gatoAvatar: string;
  humanoAvatar: string;
  totalGatoScore: number;
  totalHumanoScore: number;
  history: RoundRecord[];
  muted: boolean;
  onSelectQuestionIndex: (index: number) => void;
  onToggleQuestionHasOptions: (questionId: string) => void;
  onRecordRound: (record: RoundRecord) => void;
  onFinishGame: () => void;
}

export const LiveGameView: React.FC<LiveGameViewProps> = ({
  questions,
  currentIndex,
  gatoAvatar,
  humanoAvatar,
  totalGatoScore,
  totalHumanoScore,
  history,
  muted,
  onSelectQuestionIndex,
  onToggleQuestionHasOptions,
  onRecordRound,
  onFinishGame,
}) => {
  const currentQuestion = questions[currentIndex] || questions[0];
  const existingRecord = history.find(
    (r) => r.questionId === currentQuestion.id
  );

  // Per-round interactive state
  const [gatoOptionId, setGatoOptionId] = useState<string | undefined>(undefined);
  const [humanoOptionId, setHumanoOptionId] = useState<string | undefined>(undefined);
  const [gatoCustomText, setGatoCustomText] = useState('');
  const [humanoCustomText, setHumanoCustomText] = useState('');
  const [coupleMatchState, setCoupleMatchState] =
    useState<CoupleMatchState>('PENDING');
  const [correctOptionId, setCorrectOptionId] = useState<string | undefined>(
    undefined
  );
  const [couplePaperNote, setCouplePaperNote] = useState('');
  const [selectedWinner, setSelectedWinner] = useState<PointWinner | null>(null);
  const [showSecretNote, setShowSecretNote] = useState(false);
  const [roundSavedBanner, setRoundSavedBanner] = useState(false);

  // Optional 30s party timer
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);

  // Reset or hydrate state when switching questions
  useEffect(() => {
    setShowSecretNote(false);
    setTimerSeconds(null);
    setRoundSavedBanner(false);

    if (existingRecord) {
      setGatoOptionId(existingRecord.gatoOptionId);
      setHumanoOptionId(existingRecord.humanoOptionId);
      setGatoCustomText(existingRecord.gatoAnswerText);
      setHumanoCustomText(existingRecord.humanoAnswerText);
      setCoupleMatchState(
        existingRecord.coupleMatched ? 'MATCHED' : 'MISMATCHED'
      );
      setCorrectOptionId(existingRecord.correctOptionId);
      setCouplePaperNote(existingRecord.couplePaperNote || '');
      setSelectedWinner(existingRecord.winner);
    } else {
      setGatoOptionId(undefined);
      setHumanoOptionId(undefined);
      setGatoCustomText('');
      setHumanoCustomText('');
      setCoupleMatchState('PENDING');
      setCorrectOptionId(undefined);
      setCouplePaperNote('');
      setSelectedWinner(null);
    }
  }, [currentQuestion.id, existingRecord]);

  // Countdown effect
  useEffect(() => {
    if (timerSeconds === null || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev === null || prev <= 1) {
          playGameSound('match', muted);
          return 0;
        }
        if (prev <= 6) {
          playGameSound('tick', muted);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds, muted]);

  const handleSelectTeamOption = (
    team: 'GATO' | 'HUMANO',
    optId: string,
    optText: string
  ) => {
    playGameSound('select', muted);
    if (team === 'GATO') {
      const nextId = gatoOptionId === optId ? undefined : optId;
      setGatoOptionId(nextId);
      setGatoCustomText(nextId ? `${optId}) ${optText}` : '');
    } else {
      const nextId = humanoOptionId === optId ? undefined : optId;
      setHumanoOptionId(nextId);
      setHumanoCustomText(nextId ? `${optId}) ${optText}` : '');
    }
  };

  // Auto-calculate winner when host clicks which option Maia & Peio wrote on paper
  const handleSelectCorrectPaperOption = (optId: string, optText: string) => {
    playGameSound('select', muted);
    setCorrectOptionId(optId);
    if (!couplePaperNote) {
      setCouplePaperNote(`${optId}) ${optText}`);
    }
    if (gatoOptionId || humanoOptionId) {
      const gatoHit = gatoOptionId === optId;
      const humanoHit = humanoOptionId === optId;
      if (gatoHit && humanoHit) {
        setSelectedWinner('BOTH');
      } else if (gatoHit) {
        setSelectedWinner('GATO');
      } else if (humanoHit) {
        setSelectedWinner('HUMANO');
      } else {
        setSelectedWinner('NONE');
      }
    }
  };

  const handleCoupleMatchDecision = (matched: boolean) => {
    if (matched) {
      playGameSound('match', muted);
      setCoupleMatchState('MATCHED');
    } else {
      playGameSound('mismatch', muted);
      setCoupleMatchState('MISMATCHED');
      setSelectedWinner('NONE');
    }
  };

  const commitRound = (winner: PointWinner, matched: boolean) => {
    setSelectedWinner(winner);
    const pointsGato =
      matched && (winner === 'GATO' || winner === 'BOTH') ? 1 : 0;
    const pointsHumano =
      matched && (winner === 'HUMANO' || winner === 'BOTH') ? 1 : 0;

    if (pointsGato > 0 || pointsHumano > 0) {
      playGameSound('point', muted);
    } else {
      playGameSound('select', muted);
    }

    const record: RoundRecord = {
      questionId: currentQuestion.id,
      questionNumber: currentQuestion.number,
      questionPrompt: currentQuestion.prompt,
      category: currentQuestion.category,
      gatoAnswerText:
        gatoCustomText.trim() ||
        (gatoOptionId ? `Opción ${gatoOptionId}` : 'Contestó en vivo'),
      gatoOptionId,
      humanoAnswerText:
        humanoCustomText.trim() ||
        (humanoOptionId ? `Opción ${humanoOptionId}` : 'Contestó en vivo'),
      humanoOptionId,
      coupleMatched: matched,
      couplePaperNote: couplePaperNote.trim() || undefined,
      correctOptionId,
      winner: matched ? winner : 'NONE',
      pointsGato,
      pointsHumano,
      timestamp: new Date().toISOString(),
    };

    onRecordRound(record);
    setRoundSavedBanner(true);
  };

  const goToNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      playGameSound('question', muted);
      onSelectQuestionIndex(currentIndex + 1);
    } else {
      playGameSound('victory', muted);
      onFinishGame();
    }
  };

  const goToPrevQuestion = () => {
    if (currentIndex > 0) {
      playGameSound('question', muted);
      onSelectQuestionIndex(currentIndex - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Live Scoreboard & Question Progress Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center mb-6">
        {/* Team Gato (Maia - Guitarra) Live Score Card */}
        <div className="lg:col-span-4 p-4 bg-zinc-900/90 border border-zinc-700/80 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <ResilientImage
              src={gatoAvatar}
              alt="Team Gato (Maia)"
              fallbackType="gato"
              className="w-13 h-13 rounded-lg object-cover border border-zinc-400/50 shrink-0"
            />
            <div>
              <p className="text-xs text-zinc-400 font-medium">
                Team Maia
              </p>
              <h2 className="text-xl font-bold text-white font-display">
                Team Gato
              </h2>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-white font-mono tabular-nums">
              {totalGatoScore}
            </span>
            <span className="block text-[11px] text-zinc-400">puntos</span>
          </div>
        </div>

        {/* Center Question Navigator */}
        <div className="lg:col-span-4 p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl flex flex-col items-center justify-center">
          <div className="flex items-center justify-between w-full mb-2.5">
            <button
              type="button"
              onClick={goToPrevQuestion}
              disabled={currentIndex === 0}
              className="px-2.5 py-1 text-xs font-medium text-zinc-300 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-600 disabled:opacity-40 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Anterior
            </button>

            <span className="text-xs font-mono tabular-nums text-zinc-300">
              Pregunta{' '}
              <strong className="text-white">
                {String(currentIndex + 1).padStart(2, '0')}
              </strong>{' '}
              de {String(questions.length).padStart(2, '0')}
            </span>

            <button
              type="button"
              onClick={goToNextQuestion}
              className="px-2.5 py-1 text-xs font-medium text-zinc-300 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              {currentIndex < questions.length - 1 ? 'Siguiente' : 'Finalizar'}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Numbered quick-jump strip */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 w-full">
            {questions.map((q, idx) => {
              const played = history.some((r) => r.questionId === q.id);
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    playGameSound('question', muted);
                    onSelectQuestionIndex(idx);
                  }}
                  className={`w-7 h-7 text-xs font-mono tabular-nums rounded-md transition-colors flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-gradient-to-b from-white via-zinc-200 to-zinc-300 text-zinc-950 font-bold shadow-sm'
                      : played
                      ? 'bg-zinc-800 text-zinc-200 border border-zinc-600'
                      : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-600'
                  }`}
                  title={`Ir a la pregunta ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Team Humano (Peio - Piano) Live Score Card */}
        <div className="lg:col-span-4 p-4 bg-zinc-900/90 border border-zinc-700/80 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <ResilientImage
              src={humanoAvatar}
              alt="Team Humano (Peio)"
              fallbackType="humano"
              className="w-13 h-13 rounded-lg object-cover border border-zinc-400/50 shrink-0"
            />
            <div>
              <p className="text-xs text-zinc-400 font-medium">
                Team Peio
              </p>
              <h2 className="text-xl font-bold text-white font-display">
                Team Humano
              </h2>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-zinc-200 font-mono tabular-nums">
              {totalHumanoScore}
            </span>
            <span className="block text-[11px] text-zinc-400">puntos</span>
          </div>
        </div>
      </div>

      {/* Main Question Stage Card */}
      <div className="p-6 sm:p-8 bg-zinc-900/95 border border-zinc-700/80 rounded-2xl mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-zinc-800">
          {/* Unboxed clean metadata with typographic separators */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            <span className="font-mono tabular-nums text-zinc-200 font-semibold">
              Pregunta {String(currentQuestion.number).padStart(2, '0')}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-zinc-200 font-medium">
              {currentQuestion.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>Ambos equipos contestan</span>
            <span aria-hidden="true">·</span>
            <span>
              {currentQuestion.hasOptions
                ? 'Con opciones múltiples'
                : 'Respuesta abierta'}
            </span>
            {existingRecord && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-300 font-medium">
                  Ronda puntuada
                </span>
              </>
            )}
          </div>

          {/* Stage Utility Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setTimerSeconds((prev) =>
                  prev === null || prev === 0 ? 30 : null
                )
              }
              className={`px-3 py-1.5 text-xs font-mono tabular-nums rounded-lg border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                timerSeconds !== null && timerSeconds > 0
                  ? 'bg-zinc-100 text-zinc-950 border-white font-semibold'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              {timerSeconds === null
                ? 'Timer 30s'
                : timerSeconds > 0
                ? `${timerSeconds}s restantes`
                : '¡Tiempo cumplido!'}
            </button>

            {currentQuestion.options.length > 0 && (
              <button
                type="button"
                onClick={() => onToggleQuestionHasOptions(currentQuestion.id)}
                className="px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                {currentQuestion.hasOptions ? (
                  <>
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-300" />
                    Ocultar Opciones
                  </>
                ) : (
                  <>
                    <ListChecks className="w-3.5 h-3.5 text-zinc-200" />
                    Mostrar Opciones
                  </>
                )}
              </button>
            )}

            {currentQuestion.secretHostNote && (
              <button
                type="button"
                onClick={() => setShowSecretNote((prev) => !prev)}
                className="px-3 py-1.5 text-xs font-medium text-zinc-200 bg-zinc-950 border border-zinc-600 rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                {showSecretNote ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    Ocultar Dato de Maia
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    Ver Pista de Maia
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Main Display Question Prompt */}
        <div className="my-4">
          <h1 className="text-3xl sm:text-5xl font-bold text-white font-display leading-tight">
            {currentQuestion.prompt}
          </h1>
          {currentQuestion.subtitle && (
            <p className="text-sm sm:text-base text-zinc-300 mt-3 max-w-3xl">
              {currentQuestion.subtitle}
            </p>
          )}
        </div>

        {/* Revealed Secret Host Note */}
        {currentQuestion.secretHostNote && showSecretNote && (
          <div className="mt-4 p-4 bg-zinc-950 border border-zinc-500 rounded-xl flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-zinc-200 shrink-0" />
            <p className="text-sm text-zinc-100 font-medium">
              {currentQuestion.secretHostNote}
            </p>
          </div>
        )}

        {/* Multiple Choice Options Grid (when enabled) */}
        {currentQuestion.hasOptions && currentQuestion.options.length > 0 && (
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <p className="text-xs text-zinc-400 mb-3">
              Ambos equipos contestan · Marcá qué opción eligió el Team Gato (Maia) y cuál eligió el Team Humano (Peio):
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((opt) => {
                const isGatoPicked = gatoOptionId === opt.id;
                const isHumanoPicked = humanoOptionId === opt.id;
                const isCoupleCorrect =
                  coupleMatchState === 'MATCHED' && correctOptionId === opt.id;

                return (
                  <div
                    key={opt.id}
                    className={`p-4 rounded-xl border transition-colors flex flex-col justify-between gap-3 ${
                      isCoupleCorrect
                        ? 'bg-emerald-950/30 border-emerald-400/70'
                        : isGatoPicked || isHumanoPicked
                        ? 'bg-zinc-800/90 border-zinc-400'
                        : 'bg-zinc-950/90 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-600 font-mono font-bold text-sm text-zinc-100 flex items-center justify-center shrink-0">
                        {opt.id}
                      </span>
                      <p className="text-base font-medium text-zinc-100 leading-snug pt-0.5">
                        {opt.text}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-zinc-800/90">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleSelectTeamOption('GATO', opt.id, opt.text)
                          }
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                            isGatoPicked
                              ? 'bg-white text-zinc-950 font-semibold'
                              : 'bg-zinc-900 text-zinc-300 border border-zinc-700 hover:border-zinc-400'
                          }`}
                        >
                          {isGatoPicked
                            ? 'Elegida por Team Gato'
                            : 'Vota Team Gato'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleSelectTeamOption('HUMANO', opt.id, opt.text)
                          }
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                            isHumanoPicked
                              ? 'bg-zinc-300 text-zinc-950 font-semibold'
                              : 'bg-zinc-900 text-zinc-300 border border-zinc-700 hover:border-zinc-400'
                          }`}
                        >
                          {isHumanoPicked
                            ? 'Elegida por Team Humano'
                            : 'Vota Team Humano'}
                        </button>
                      </div>

                      {coupleMatchState === 'MATCHED' && (
                        <button
                          type="button"
                          onClick={() =>
                            handleSelectCorrectPaperOption(opt.id, opt.text)
                          }
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                            isCoupleCorrect
                              ? 'bg-emerald-400 text-zinc-950 font-semibold'
                              : 'bg-zinc-900 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-950'
                          }`}
                        >
                          {isCoupleCorrect
                            ? 'Escrita en el Papel'
                            : 'Es la del Papel'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Both Teams Answer Boxes (Symmetrical for Team Gato & Team Humano) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-zinc-800">
          <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl">
            <label className="block text-xs font-semibold text-zinc-200 mb-1.5">
              1. Respuesta de Team Gato (Maia):
            </label>
            <input
              type="text"
              value={gatoCustomText}
              onChange={(e) => setGatoCustomText(e.target.value)}
              placeholder="Escribí o seleccioná arriba qué contestó el Team Gato..."
              className="w-full px-3.5 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-white"
            />
          </div>
          <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl">
            <label className="block text-xs font-semibold text-zinc-200 mb-1.5">
              2. Respuesta de Team Humano (Peio):
            </label>
            <input
              type="text"
              value={humanoCustomText}
              onChange={(e) => setHumanoCustomText(e.target.value)}
              placeholder="Escribí o seleccioná arriba qué contestó el Team Humano..."
              className="w-full px-3.5 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-white"
            />
          </div>
        </div>
      </div>

      {/* Step 2: Couple Paper Resolution & Point Assignment */}
      <div className="p-6 sm:p-8 bg-zinc-900/95 border border-zinc-700/80 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <p className="text-xs text-zinc-400 mb-1">
              El Veredicto de los Novios · Maia y Peio dan vuelta su papel
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              ¿Coincidieron Maia y Peio en la respuesta del papel?
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleCoupleMatchDecision(false)}
              className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                coupleMatchState === 'MISMATCHED'
                  ? 'bg-rose-600 text-white border-rose-400'
                  : 'bg-zinc-950 text-zinc-200 border-zinc-700 hover:border-rose-400/60'
              }`}
            >
              <XCircle className="w-4 h-4 text-rose-400" />
              No Coincidieron en el Papel
            </button>

            <button
              type="button"
              onClick={() => handleCoupleMatchDecision(true)}
              className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                coupleMatchState === 'MATCHED'
                  ? 'bg-gradient-to-b from-white via-zinc-200 to-zinc-300 text-zinc-950 border-white'
                  : 'bg-zinc-950 text-zinc-100 border-zinc-600 hover:border-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              ¡Sí, Coincidieron en el Papel!
            </button>
          </div>
        </div>

        {/* Branch 1: Maia & Peio DID NOT MATCH on paper */}
        {coupleMatchState === 'MISMATCHED' && (
          <div className="mt-6 p-6 bg-zinc-950 border border-rose-500/40 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-rose-200 font-display">
                  ¡No sabemos cuál es la respuesta correcta!
                </h3>
                <p className="text-sm text-zinc-300 mt-1">
                  Maia y Peio escribieron cosas distintas en el papel. Como ni los novios coinciden, ningún equipo suma puntos en esta ronda.
                </p>
              </div>

              <button
                type="button"
                onClick={() => commitRound('NONE', false)}
                className="px-5 py-2.5 text-xs font-semibold text-zinc-950 bg-gradient-to-b from-white via-zinc-200 to-zinc-300 rounded-lg hover:from-white hover:to-zinc-200 transition-colors whitespace-nowrap shrink-0"
              >
                Registrar Ronda sin Coincidencia (0 pts)
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800">
              <label className="block text-xs text-zinc-400 mb-1.5">
                ¿Qué escribió cada uno en su papel? (Opcional para guardar la anécdota):
              </label>
              <input
                type="text"
                value={couplePaperNote}
                onChange={(e) => setCouplePaperNote(e.target.value)}
                placeholder="Ej. Maia escribió 'Volare' y Peio escribió otra canción..."
                className="w-full px-3.5 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-white"
              />
            </div>
          </div>
        )}

        {/* Branch 2: Maia & Peio MATCHED on paper -> Award Points */}
        {coupleMatchState === 'MATCHED' && (
          <div className="mt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Respuesta oficial escrita por Maia y Peio en el papel (opcional anotar):
                </label>
                <input
                  type="text"
                  value={couplePaperNote}
                  onChange={(e) => setCouplePaperNote(e.target.value)}
                  placeholder="Ej. Volare / Pinot Noir / 10 prendas..."
                  className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-white"
                />
              </div>
              <p className="text-xs text-zinc-400">
                ¿Con qué equipo coincidió el papel de Maia y Peio? Elegí quién suma punto en la Tabla de Posiciones:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => commitRound('GATO', true)}
                className={`p-4 rounded-xl border text-left transition-colors flex flex-col justify-between ${
                  selectedWinner === 'GATO'
                    ? 'bg-gradient-to-b from-white via-zinc-200 to-zinc-300 text-zinc-950 border-white font-semibold'
                    : 'bg-zinc-950 text-zinc-100 border-zinc-800 hover:border-zinc-500'
                }`}
              >
                <span className="text-xs font-mono uppercase tracking-wider opacity-80">
                  +1 Punto
                </span>
                <span className="text-lg font-bold font-display mt-1">
                  Punto Team Gato (Maia)
                </span>
                <span className="text-xs opacity-80 mt-1">
                  Acertó el equipo de la novia
                </span>
              </button>

              <button
                type="button"
                onClick={() => commitRound('HUMANO', true)}
                className={`p-4 rounded-xl border text-left transition-colors flex flex-col justify-between ${
                  selectedWinner === 'HUMANO'
                    ? 'bg-gradient-to-b from-white via-zinc-200 to-zinc-300 text-zinc-950 border-white font-semibold'
                    : 'bg-zinc-950 text-zinc-100 border-zinc-800 hover:border-zinc-500'
                }`}
              >
                <span className="text-xs font-mono uppercase tracking-wider opacity-80">
                  +1 Punto
                </span>
                <span className="text-lg font-bold font-display mt-1">
                  Punto Team Humano (Peio)
                </span>
                <span className="text-xs opacity-80 mt-1">
                  Acertó el equipo del novio
                </span>
              </button>

              <button
                type="button"
                onClick={() => commitRound('BOTH', true)}
                className={`p-4 rounded-xl border text-left transition-colors flex flex-col justify-between ${
                  selectedWinner === 'BOTH'
                    ? 'bg-gradient-to-b from-white via-zinc-200 to-zinc-300 text-zinc-950 border-white font-semibold'
                    : 'bg-zinc-950 text-zinc-100 border-zinc-800 hover:border-zinc-500'
                }`}
              >
                <span className="text-xs font-mono uppercase tracking-wider opacity-80">
                  +1 Punto a Cada Uno
                </span>
                <span className="text-lg font-bold font-display mt-1">
                  ¡Ambos Equipos Acertaron!
                </span>
                <span className="text-xs opacity-80 mt-1">
                  Gatos y Humanos suman
                </span>
              </button>

              <button
                type="button"
                onClick={() => commitRound('NONE', true)}
                className={`p-4 rounded-xl border text-left transition-colors flex flex-col justify-between ${
                  selectedWinner === 'NONE'
                    ? 'bg-zinc-700 text-white border-zinc-400 font-semibold'
                    : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                <span className="text-xs font-mono uppercase tracking-wider opacity-80">
                  0 Puntos
                </span>
                <span className="text-lg font-bold font-display mt-1">
                  Ningún Equipo Acertó
                </span>
                <span className="text-xs opacity-80 mt-1">
                  Solo coincidieron los novios
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Banner & Quick Advance */}
        {(roundSavedBanner || existingRecord) && (
          <div className="mt-6 pt-5 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-sm text-zinc-200">
              <Trophy className="w-4 h-4 text-zinc-300 shrink-0" />
              <span>
                Puntaje registrado en la Tabla de Posiciones. Podés avanzar a la siguiente pregunta.
              </span>
            </div>

            <button
              type="button"
              onClick={goToNextQuestion}
              className="px-5 py-2.5 text-xs font-semibold text-zinc-950 bg-gradient-to-b from-white via-zinc-200 to-zinc-300 rounded-lg hover:from-white hover:to-zinc-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              {currentIndex < questions.length - 1
                ? 'Siguiente Pregunta'
                : 'Ver Resultado Final de la Despedida'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
