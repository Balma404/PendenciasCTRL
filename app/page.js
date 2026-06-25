"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ParticipantForm from "../components/ParticipantForm";
import ParticipantCard from "../components/ParticipantCard";

const POLL_INTERVAL = 3000;

export default function Home() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);
  const firstLoad = useRef(true);

  const fetchParticipants = useCallback(async () => {
    try {
      const res = await fetch("/api/participants", { cache: "no-store" });
      if (!res.ok) throw new Error("Falha ao carregar");
      setParticipants(await res.json());
      setError(null);
    } catch (err) {
      console.error(err);
      if (firstLoad.current)
        setError("Não foi possível carregar os dados. Verifique se o PostgreSQL está rodando.");
    } finally {
      firstLoad.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParticipants();
    const interval = setInterval(fetchParticipants, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchParticipants]);

  async function handleAdd({ nome, file }) {
    setAdding(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("nome", nome);
      if (file) formData.append("file", file);
      const res = await fetch("/api/participants", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Falha ao adicionar");
      await fetchParticipants();
    } catch (err) {
      console.error(err);
      setError("Erro ao adicionar participante. Tente novamente.");
    } finally {
      setAdding(false);
    }
  }

  async function updatePendencias(participant, delta) {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participant.id
          ? { ...p, pendencias: Math.max(0, p.pendencias + delta) }
          : p
      )
    );
    try {
      await fetch(`/api/participants/${participant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta }),
      });
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar pendências.");
      fetchParticipants();
    }
  }

  async function handleDelete(participant) {
    if (!confirm(`Remover ${participant.nome}?`)) return;
    setParticipants((prev) => prev.filter((p) => p.id !== participant.id));
    try {
      await fetch(`/api/participants/${participant.id}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
      setError("Erro ao remover participante.");
      fetchParticipants();
    }
  }

  const resumo = useMemo(() => {
    const r = { baixo: 0, medio: 0, critico: 0, total: participants.length };
    for (const p of participants) {
      const c = p.pendencias ?? 0;
      if (c >= 8) r.critico += 1;
      else if (c >= 4) r.medio += 1;
      else r.baixo += 1;
    }
    return r;
  }, [participants]);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-black tracking-tight text-zinc-100 sm:text-2xl">
                Pendências<span className="text-zinc-500">CTRL</span>
              </h1>
              <p className="mt-0.5 text-xs text-zinc-600">
                {resumo.total} participante{resumo.total !== 1 ? "s" : ""} monitorado{resumo.total !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Pills de resumo */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300">Baixo: {resumo.baixo}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span className="text-xs font-semibold text-amber-300">Médio: {resumo.medio}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                <span className="text-xs font-semibold text-red-300">Crítico: {resumo.critico}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Formulário */}
        <section className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-600">
            Novo Participante
          </p>
          <ParticipantForm onAdd={handleAdd} busy={adding} />
        </section>

        {/* Erro */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-950/50 px-4 py-3 text-sm text-red-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        {/* Lista */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-zinc-600">
            <svg className="h-8 w-8 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="text-sm">Carregando...</span>
          </div>
        ) : participants.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-zinc-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <p className="text-sm">Nenhum participante. Adicione o primeiro acima.</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-600">
              Participantes
            </p>
            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {participants.map((p) => (
                <ParticipantCard
                  key={p.id}
                  participant={p}
                  onIncrement={(x) => updatePendencias(x, 1)}
                  onDecrement={(x) => updatePendencias(x, -1)}
                  onDelete={handleDelete}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
