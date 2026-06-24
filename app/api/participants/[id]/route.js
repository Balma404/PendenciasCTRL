import { NextResponse } from "next/server";
import { query, mapParticipant } from "../../../../lib/db";
import { deleteFile } from "../../../../lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PATCH /api/participants/[id] — ajusta a quantidade de pendências.
// Aceita { pendencias } (valor absoluto) ou { delta } (incremento/decremento).
export async function PATCH(request, { params }) {
  try {
    const id = Number(params.id);
    const body = await request.json().catch(() => ({}));

    let result;
    if (typeof body.delta === "number") {
      result = await query(
        `UPDATE participantes
         SET pendencias = GREATEST(0, pendencias + $1)
         WHERE id = $2
         RETURNING *`,
        [body.delta, id]
      );
    } else if (typeof body.pendencias === "number") {
      result = await query(
        `UPDATE participantes
         SET pendencias = GREATEST(0, $1)
         WHERE id = $2
         RETURNING *`,
        [Math.trunc(body.pendencias), id]
      );
    } else {
      return NextResponse.json(
        { error: "Informe 'delta' ou 'pendencias'." },
        { status: 400 }
      );
    }

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Participante não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(mapParticipant(result.rows[0]));
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao atualizar pendências." },
      { status: 500 }
    );
  }
}

// DELETE /api/participants/[id] — remove participante e sua foto.
export async function DELETE(_request, { params }) {
  try {
    const id = Number(params.id);
    const { rows, rowCount } = await query(
      "DELETE FROM participantes WHERE id = $1 RETURNING photo_path",
      [id]
    );

    if (rowCount === 0) {
      return NextResponse.json(
        { error: "Participante não encontrado." },
        { status: 404 }
      );
    }

    await deleteFile(rows[0].photo_path);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao remover participante." },
      { status: 500 }
    );
  }
}
