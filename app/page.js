"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

import { db, storage } from "../lib/firebase";
import ParticipantForm from "../components/ParticipantForm";
import ParticipantCard from "../components/ParticipantCard";

const COLLECTION = "participantes";

export default function Home() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  // Lista em tempo real com onSnapshot.
  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setParticipants(
          snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        );
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(
          "Não foi possível carregar os dados. Verifique a configuração do Firebase em .env.local."
        );
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Adiciona participante: faz upload da foto (se houver) e salva no Firestore.
  async function handleAdd({ nome, file }) {
    setAdding(true);
    setError(null);
    try {
      let photoURL = "";
      let photoPath = "";

      if (file) {
        photoPath = `participantes/${Date.now()}-${file.name}`;
        const fileRef = storageRef(storage, photoPath);
        await uploadBytes(fileRef, file);
        photoURL = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, COLLECTION), {
        nome,
        photoURL,
        photoPath,
        pendencias: 0,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
      setError("Erro ao adicionar participante. Tente novamente.");
    } finally {
      setAdding(false);
    }
  }

  async function updatePendencias(participant, delta) {
    const next = Math.max(0, (participant.pendencias ?? 0) + delta);
    try {
      await updateDoc(doc(db, COLLECTION, participant.id), { pendencias: next });
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar pendências.");
    }
  }

  async function handleDelete(participant) {
    if (!confirm(`Remover ${participant.nome}?`)) return;
    try {
      await deleteDoc(doc(db, COLLECTION, participant.id));
      if (participant.photoPath) {
        await deleteObject(storageRef(storage, participant.photoPath)).catch(
          () => {}
        );
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao remover participante.");
    }
  }

  // Resumo por nível para o cabeçalho.
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
