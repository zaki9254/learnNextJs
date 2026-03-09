import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// ── GET: Fetch all todos ──────────────────────────────
// What happens:
// 1. Browser requests GET /api/todos
// 2. Prisma runs: SELECT * FROM todos ORDER BY createdAt DESC
// 3. Returns the rows as JSON
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(todos);
  } catch (error) {
    console.log("GET error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 },
    );
  }
}

// ── POST: Create a new todo ───────────────────────────
// What happens:
// 1. Browser sends POST /api/todos with { task: "Buy milk" }
// 2. Prisma runs: INSERT INTO todos (task) VALUES ('Buy milk')
// 3. Returns the newly created row as JSON
export async function POST(request) {
  try {
    const { task } = await request.json();

    if (!task || !task.trim()) {
      return NextResponse.json({ error: "Task is required" }, { status: 400 });
    }

    const todo = await prisma.todo.create({
      data: { task },
    });

    console.log("Created todo:", todo);
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.log("POST error:", error.message);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 },
    );
  }
}
