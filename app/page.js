"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ParticipantForm from "../components/ParticipantForm";
import ParticipantCard from "../components/ParticipantCard";

const POLL_INTERVAL = 3000; // atualização "em tempo real" via polling

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
      const data = await res.json();
      setParticipants(data);
      setError(null);
    } catch (err) {
      console.error(err);
      if (firstLoad.current) {
        setError(
          "Não foi possível carregar os dados. Verifique se o PostgreSQL está rodando (DATABASE_URL)."
        );
      }
    } finally {
      firstLoad.current = false;
      setLoading(false);
    }
  }, []);

  // Lista "em tempo real": busca inicial + polling periódico.
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

      const res = await fetch("/api/participants", {
        method: "POST",
        body: formData,
      });
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
    // Atualização otimista para resposta imediata na UI.
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
    const r = { baixo: 0, medio: 0, critico: 0 };
    for (const p of participants) {
      const c = p.pendencias ?? 0;
      if (c >= 8) r.critico += 1;
      else if (c >= 4) r.medio += 1;
      else r.baixo += 1;
    }
    return r;
  }, [participants]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Dashboard de Pendências
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Controle das pendências dos participantes em tempo real.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
            Baixo (0–3): {resumo.baixo}
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
            Médio (4–7): {resumo.medio}
          </span>
          <span className="rounded-full bg-red-100 px-3 py-1 text-red-700">
            Crítico (8+): {resumo.critico}
          </span>
        </div>
      </header>

      <section className="mb-8">
        <ParticipantForm onAdd={handleAdd} busy={adding} />
      </section>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="py-12 text-center text-slate-400">Carregando...</p>
      ) : participants.length === 0 ? (
        <p className="py-12 text-center text-slate-400">
          Nenhum participante cadastrado. Adicione o primeiro acima.
        </p>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      )}
    </main>
  );
}
