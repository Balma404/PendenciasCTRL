"use client";

import { useRef, useState } from "react";

// Formulário simples: Nome, seleção de arquivo (Foto) e botão Adicionar.
export default function ParticipantForm({ onAdd, busy }) {
  const [nome, setNome] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const previewURL = file ? URL.createObjectURL(file) : null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nome.trim() || busy) return;

    await onAdd({ nome: nome.trim(), file });

    // Limpa o formulário após adicionar.
    setNome("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label
          htmlFor="nome"
          className="mb-1 block text-sm font-medium text-slate-600"
        >
          Nome
        </label>
        <input
          id="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do participante"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div className="flex-1">
        <label
          htmlFor="foto"
          className="mb-1 block text-sm font-medium text-slate-600"
        >
          Foto
        </label>
        <div className="flex items-center gap-3">
          {previewURL && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewURL}
              alt="Pré-visualização"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-200"
            />
          )}
          <input
            id="foto"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={busy || !nome.trim()}
        className="rounded-lg bg-slate-800 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Adicionando..." : "Adicionar"}
      </button>
    </form>
  );
}
