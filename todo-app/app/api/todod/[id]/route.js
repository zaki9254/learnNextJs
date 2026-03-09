import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// ── PATCH: Toggle done/undone ─────────────────────────
// What happens:
// 1. Browser sends PATCH /api/todos/3 with { done: true }
// 2. Prisma runs: UPDATE todos SET done=true WHERE id=3
// 3. Returns the updated row
export async function PATCH(request, { params }) {
  try {
    const { done } = await request.json();
    const id = parseInt(params.id);

    const todo = await prisma.todo.update({
      where: { id },
      data: { done },
    });

    console.log("Updated todo:", todo);
    return NextResponse.json(todo);
  } catch (error) {
    console.log("PATCH error:", error.message);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 },
    );
  }
}

// ── DELETE: Delete a todo ─────────────────────────────
// What happens:
// 1. Browser sends DELETE /api/todos/3
// 2. Prisma runs: DELETE FROM todos WHERE id=3
// 3. Returns success message
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    await prisma.todo.delete({
      where: { id },
    });

    console.log("Deleted todo id:", id);
    return NextResponse.json({ message: "Todo deleted" });
  } catch (error) {
    console.log("DELETE error:", error.message);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 },
    );
  }
}
