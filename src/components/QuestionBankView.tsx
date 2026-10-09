import React, { useState } from 'react';
import { Question, QuestionOption } from '../types/game';
import { Plus, Edit3, Trash2, Check, X, RotateCcw, Play } from 'lucide-react';

interface QuestionBankViewProps {
  questions: Question[];
  currentQuestionIndex: number;
  completedQuestionIds: Set<string>;
  onUpdateQuestions: (updated: Question[]) => void;
  onResetDefaultQuestions: () => void;
  onJumpToQuestion: (index: number) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  questions,
  currentQuestionIndex,
  completedQuestionIds,
  onUpdateQuestions,
  onResetDefaultQuestions,
  onJumpToQuestion,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'options' | 'open'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state for editing or creating
  const [formCategory, setFormCategory] = useState('');
  const [formPrompt, setFormPrompt] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formHasOptions, setFormHasOptions] = useState(true);
  const [formSecretNote, setFormSecretNote] = useState('');
  const [formOptions, setFormOptions] = useState<QuestionOption[]>([
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' },
    { id: 'D', text: '' },
  ]);
  const [confirmReset, setConfirmReset] = useState(false);

  const startEdit = (q: Question) => {
    setIsCreating(false);
    setEditingId(q.id);
    setFormCategory(q.category);
    setFormPrompt(q.prompt);
    setFormSubtitle(q.subtitle || '');
    setFormHasOptions(q.hasOptions);
    setFormSecretNote(q.secretHostNote || '');
    setFormOptions(
      q.options.length === 4
        ? q.options.map((o) => ({ ...o }))
        : [
            { id: 'A', text: q.options[0]?.text || '' },
            { id: 'B', text: q.options[1]?.text || '' },
            { id: 'C', text: q.options[2]?.text || '' },
            { id: 'D', text: q.options[3]?.text || '' },
          ]
    );
  };

  const startCreate = () => {
    setEditingId(null);
    setIsCreating(true);
    setFormCategory('Anécdota de Boda');
    setFormPrompt('');
    setFormSubtitle('Ambos equipos contestan (Team Gato y Team Humano) · Maia y Peio escriben en su papel.');
    setFormHasOptions(true);
    setFormSecretNote('');
    setFormOptions([
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' },
    ]);
  };

  const handleSave = () => {
    if (!formPrompt.trim()) return;

    const cleanedOptions = formOptions.map((opt, idx) => ({
      id: ['A', 'B', 'C', 'D'][idx],
      text: opt.text.trim() || `Opción ${['A', 'B', 'C', 'D'][idx]}`,
    }));

    if (isCreating) {
      const newQuestion: Question = {
        id: `q-custom-${Date.now()}`,
        number: questions.length + 1,
        category: formCategory.trim() || 'Especial Novios',
        prompt: formPrompt.trim(),
        subtitle: formSubtitle.trim() || undefined,
        hasOptions: formHasOptions,
        secretHostNote: formSecretNote.trim() || undefined,
        options: cleanedOptions,
      };
      onUpdateQuestions([...questions, newQuestion]);
      setIsCreating(false);
    } else if (editingId) {
      const updated = questions.map((q) =>
        q.id === editingId
          ? {
              ...q,
              category: formCategory.trim() || 'Especial Novios',
              prompt: formPrompt.trim(),
              subtitle: formSubtitle.trim() || undefined,
              hasOptions: formHasOptions,
              secretHostNote: formSecretNote.trim() || undefined,
              options: cleanedOptions,
            }
          : q
      );
      onUpdateQuestions(updated);
      setEditingId(null);
    }
  };

  const handleToggleQuestionOptions = (qId: string) => {
    const updated = questions.map((q) =>
      q.id === qId ? { ...q, hasOptions: !q.hasOptions } : q
    );
    onUpdateQuestions(updated);
  };

  const handleDelete = (qId: string) => {
    if (questions.length <= 1) return;
    const filtered = questions
      .filter((q) => q.id !== qId)
      .map((q, idx) => ({ ...q, number: idx + 1 }));
    onUpdateQuestions(filtered);
  };

  const filteredQuestions = questions.filter((q) => {
    if (filterMode === 'options') return q.hasOptions;
    if (filterMode === 'open') return !q.hasOptions;
    return true;
  });

  return (
    <section className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800">
        <div>
          <p className="text-xs text-zinc-400 mb-2">
            Configuración de Partida · {questions.length} preguntas cargadas · {completedQuestionIds.size} jugadas
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-display">
            Banco de Preguntas de Maia &amp; Peio
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Podés activar o desactivar las opciones múltiples en cualquier pregunta, editar las respuestas o agregar nuevas preguntas para la despedida de soltera.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="px-4 py-2 text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar Originales
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetDefaultQuestions();
                  setConfirmReset(false);
                }}
                className="px-3 py-2 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-500 transition-colors whitespace-nowrap shrink-0"
              >
                Confirmar Restauración
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3 py-2 text-xs font-medium text-zinc-300 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors whitespace-nowrap shrink-0"
              >
                Cancelar
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={startCreate}
            className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-gradient-to-b from-white via-zinc-200 to-zinc-300 rounded-lg hover:from-white hover:to-zinc-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar Pregunta
          </button>
        </div>
      </div>

      {/* Interactive Filter Controls */}
      <div className="flex items-center justify-between gap-4 my-6">
        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterMode === 'all'
                ? 'bg-zinc-200 text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Todas ({questions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('options')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterMode === 'options'
                ? 'bg-zinc-200 text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Con Opciones ({questions.filter((q) => q.hasOptions).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('open')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              filterMode === 'open'
                ? 'bg-zinc-200 text-zinc-950 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Respuesta Abierta ({questions.filter((q) => !q.hasOptions).length})
          </button>
        </div>
      </div>

      {/* Create / Edit Form Panel */}
      {(isCreating || editingId) && (
        <div className="mb-8 p-6 bg-zinc-900 border border-zinc-700 rounded-xl">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-white font-display">
              {isCreating ? 'Nueva Pregunta para Maia & Peio' : 'Editar Pregunta'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg"
              aria-label="Cerrar formulario"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Categoría o Temática
              </label>
              <input
                type="text"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="Ej. Música, Gatos, Patagonia, Vinos..."
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Modalidad de Respuesta en Pantalla
              </label>
              <div className="flex items-center gap-2 p-1 bg-zinc-950 border border-zinc-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setFormHasOptions(true)}
                  className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    formHasOptions
                      ? 'bg-zinc-200 text-zinc-950 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Con 4 Opciones (A, B, C, D)
                </button>
                <button
                  type="button"
                  onClick={() => setFormHasOptions(false)}
                  className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    !formHasOptions
                      ? 'bg-zinc-200 text-zinc-950 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Abierta (Sin opciones)
                </button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Pregunta Principal
            </label>
            <input
              type="text"
              value={formPrompt}
              onChange={(e) => setFormPrompt(e.target.value)}
              placeholder="Ej. ¿Cuántos videos de gatos mira Peio por día?"
              className="w-full px-3.5 py-2.5 text-base font-medium bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Aclaración o Subtítulo (opcional)
              </label>
              <input
                type="text"
                value={formSubtitle}
                onChange={(e) => setFormSubtitle(e.target.value)}
                placeholder="Ambos equipos contestan..."
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Nota Secreta para quien dirige (oculta hasta revelar)
              </label>
              <input
                type="text"
                value={formSecretNote}
                onChange={(e) => setFormSecretNote(e.target.value)}
                placeholder="Ej. Maia me contó que la respuesta es Volare"
                className="w-full px-3.5 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium text-zinc-300 mb-2">
              Opciones Múltiples (quedan listas incluso si elegís jugarla abierta)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formOptions.map((opt, idx) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <span className="w-7 h-9 flex items-center justify-center text-xs font-mono font-bold text-zinc-200 bg-zinc-950 border border-zinc-700 rounded-lg shrink-0">
                    {opt.id}
                  </span>
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => {
                      const next = [...formOptions];
                      next[idx] = { ...next[idx], text: e.target.value };
                      setFormOptions(next);
                    }}
                    placeholder={`Texto de la opción ${opt.id}...`}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
              className="px-4 py-2 text-xs font-medium text-zinc-300 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors whitespace-nowrap shrink-0"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-zinc-950 bg-gradient-to-b from-white via-zinc-200 to-zinc-300 rounded-lg hover:from-white hover:to-zinc-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Guardar Pregunta
            </button>
          </div>
        </div>
      )}

      {/* Question List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const realIndex = questions.findIndex((item) => item.id === q.id);
          const isCompleted = completedQuestionIds.has(q.id);
          const isCurrent = realIndex === currentQuestionIndex;

          return (
            <div
              key={q.id}
              className={`p-5 bg-zinc-900/90 border rounded-xl transition-colors ${
                isCurrent
                  ? 'border-zinc-400'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  {/* Unboxed clean metadata with typographic separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-mono tabular-nums">
                    <span className="text-zinc-100 font-semibold">
                      Pregunta {String(q.number).padStart(2, '0')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-sans text-zinc-300">{q.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-sans">
                      {q.hasOptions ? 'Con opciones múltiples' : 'Respuesta abierta'}
                    </span>
                    {isCompleted && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-sans text-emerald-300 font-medium">
                          Ya jugada
                        </span>
                      </>
                    )}
                    {isCurrent && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-sans text-white font-medium">
                          En pantalla ahora
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white font-display">
                    {q.prompt}
                  </h3>

                  {q.subtitle && (
                    <p className="text-xs text-zinc-400">{q.subtitle}</p>
                  )}

                  {q.secretHostNote && (
                    <p className="text-xs text-zinc-200 pt-1">
                      Nota de anfitrión: {q.secretHostNote}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleQuestionOptions(q.id)}
                    className="px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors whitespace-nowrap shrink-0"
                  >
                    {q.hasOptions ? 'Pasar a Abierta' : 'Activar Opciones'}
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(q)}
                    className="px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Editar
                  </button>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDelete(q.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 bg-zinc-950 border border-zinc-800 rounded-lg transition-colors shrink-0"
                      aria-label="Eliminar pregunta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onJumpToQuestion(realIndex)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-gradient-to-b from-white via-zinc-200 to-zinc-300 rounded-lg hover:from-white hover:to-zinc-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Jugar Esta
                  </button>
                </div>
              </div>

              {q.hasOptions && q.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-zinc-800/80">
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      className="text-xs text-zinc-300 flex items-baseline gap-2"
                    >
                      <span className="font-mono font-bold text-white shrink-0">
                        {opt.id})
                      </span>
                      <span>{opt.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
