"use client";

import { getStatus } from "../lib/status";

function Avatar({ name, photoURL, ring }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <div className={`relative h-20 w-20 shrink-0`}>
      <div
        className={`h-20 w-20 overflow-hidden rounded-full ring-2 ${ring} bg-zinc-800`}
      >
        {photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoURL}
            alt={`Foto de ${name}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-700 text-2xl font-bold text-zinc-300">
            {initial}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ParticipantCard({
  participant,
  onIncrement,
  onDecrement,
  onDelete,
}) {
  const count = participant.pendencias ?? 0;
  const status = getStatus(count);

  return (
    <div
      className={`group relative flex flex-col gap-5 rounded-2xl border p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${status.card} ${status.glow}`}
    >
      {/* Botão remover */}
      <button
        onClick={() => onDelete(participant)}
        aria-label="Remover participante"
        className="absolute right-4 top-4 rounded-full p-1.5 text-zinc-600 opacity-0 transition-all group-hover:opacity-100 hover:bg-zinc-700/50 hover:text-red-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Header: avatar + nome + badge */}
      <div className="flex items-center gap-4">
        <Avatar name={participant.nome} photoURL={participant.photoURL} ring={status.ring} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-xl font-bold text-zinc-100 tracking-tight">
            {participant.nome}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${status.dot} animate-pulse`} />
            <span className={`rounded-full px-3 py-0.5 text-xs font-semibold tracking-wide uppercase ${status.badge}`}>
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-zinc-700/50" />

      {/* Counter + botões */}
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-5xl font-black tabular-nums leading-none ${status.counter}`}>
            {count}
          </p>
          <p className="mt-1 text-xs uppercase tracking-widest text-zinc-500">
            Pendências
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onDecrement(participant)}
            disabled={count <= 0}
            aria-label="Diminuir pendências"
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-xl font-bold text-zinc-300 shadow transition hover:bg-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 active:scale-95"
          >
            −
          </button>
          <button
            onClick={() => onIncrement(participant)}
            aria-label="Aumentar pendências"
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-xl font-bold text-zinc-900 shadow transition hover:bg-white active:scale-95"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
