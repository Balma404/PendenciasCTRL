"use client";

import { getStatus } from "../lib/status";

// Avatar circular com fallback para a inicial do nome quando não há foto.
function Avatar({ name, photoURL, ring }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <div
      className={`h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ${ring} bg-white`}
    >
      {photoURL ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoURL}
          alt={`Foto de ${name}`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-slate-200 text-xl font-semibold text-slate-500">
          {initial}
        </div>
      )}
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
      className={`flex flex-col gap-4 rounded-2xl border-2 p-5 shadow-sm transition hover:shadow-md ${status.card}`}
    >
      <div className="flex items-center gap-4">
        <Avatar name={participant.nome} photoURL={participant.photoURL} ring={status.ring} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-slate-800">
            {participant.nome}
          </h3>
          <span
            className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${status.badge}`}
          >
            {status.label}
          </span>
        </div>
        <button
          onClick={() => onDelete(participant)}
          aria-label="Remover participante"
          title="Remover participante"
          className="rounded-full p-1.5 text-slate-400 transition hover:bg-white hover:text-red-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="leading-tight">
          <p className="text-3xl font-bold text-slate-800">{count}</p>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Pendências
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onDecrement(participant)}
            disabled={count <= 0}
            aria-label="Diminuir pendências"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>
          <button
            onClick={() => onIncrement(participant)}
            aria-label="Aumentar pendências"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-2xl font-bold text-white shadow-sm transition hover:bg-slate-700"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
