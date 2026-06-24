import { NextResponse } from "next/server";
import { query, mapParticipant } from "../../../lib/db";
import { saveFile } from "../../../lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/participants — lista todos os participantes (mais recentes primeiro).
export async function GET() {
  try {
    const { rows } = await query(
      "SELECT * FROM participantes ORDER BY created_at DESC"
    );
    return NextResponse.json(rows.map(mapParticipant));
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao listar participantes." },
      { status: 500 }
    );
  }
}

// POST /api/participants — cria participante (multipart: nome + foto opcional).
export async function POST(request) {
  try {
    const form = await request.formData();
    const nome = (form.get("nome") || "").toString().trim();
    const file = form.get("file");

    if (!nome) {
      return NextResponse.json(
        { error: "O nome é obrigatório." },
        { status: 400 }
      );
    }

    let photoPath = "";
    let photoURL = "";
    if (file && typeof file === "object" && file.size > 0) {
      photoPath = await saveFile(file);
      photoURL = `/api/uploads/${photoPath}`;
    }

    const { rows } = await query(
      `INSERT INTO participantes (nome, photo_url, photo_path, pendencias)
       VALUES ($1, $2, $3, 0)
       RETURNING *`,
      [nome, photoURL, photoPath]
    );

    return NextResponse.json(mapParticipant(rows[0]), { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao adicionar participante." },
      { status: 500 }
    );
  }
}
