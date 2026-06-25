"use client";

import { useRef, useState } from "react";

export default function ParticipantForm({ onAdd, busy }) {
  const [nome, setNome] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const previewURL = file ? URL.createObjectURL(file) : null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nome.trim() || busy) return;
    await onAdd({ nome: nome.trim(), file });
    setNome("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl backdrop-blur sm:flex-row sm:items-end"
    >
      {/* Nome */}
      <div className="flex-1">
        <label htmlFor="nome" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Nome
        </label>
        <input
          id="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do participante"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/30"
        />
      </div>

      {/* Foto */}
      <div className="flex-1">
        <label htmlFor="foto" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Foto
        </label>
        <div className="flex items-center gap-3">
          {previewURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewURL}
              alt="Pré-visualização"
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-zinc-600"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
          )}
          <input
            id="foto"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-zinc-500 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-700 file:px-3 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-wide file:text-zinc-300 hover:file:bg-zinc-600"
          />
        </div>
      </div>

      {/* Botão */}
      <button
        type="submit"
        disabled={busy || !nome.trim()}
        className="flex items-center gap-2 rounded-xl bg-zinc-100 px-6 py-3 font-semibold text-zinc-900 shadow transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
      >
        {busy ? (
          <>
            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Adicionando...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Adicionar
          </>
        )}
      </button>
    </form>
  );
}
