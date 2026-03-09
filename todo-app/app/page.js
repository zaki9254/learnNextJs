"use client";

import { useState, useEffect } from "react";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(true);

  // ─────────────────────────────────────────
  // STEP A: Fetch all todos when page loads
  // Flow: page loads → useEffect runs → GET /api/todos
  //       → prisma.todo.findMany() → PostgreSQL
  //       → returns rows → setTodos(data)
  // ─────────────────────────────────────────
  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────────────────
  // STEP B: Create a new todo
  // Flow: click Add → POST /api/todos with { task }
  //       → prisma.todo.create() → PostgreSQL saves row
  //       → returns new todo → add to top of list
  // ─────────────────────────────────────────
  async function handleAdd() {
    if (!task.trim()) return;

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setTask("");
    } catch (error) {
      console.error("Failed to add:", error);
    }
  }

  // ─────────────────────────────────────────
  // STEP C: Toggle done/undone
  // Flow: click checkbox → PATCH /api/todos/3 with { done: true }
  //       → prisma.todo.update() → PostgreSQL updates row
  //       → returns updated todo → update in list
  // ─────────────────────────────────────────
  async function handleToggle(todo) {
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !todo.done }),
      });
      const updated = await res.json();
      setTodos(todos.map((t) => (t.id === updated.id ? updated : t)));
    } catch (error) {
      console.error("Failed to toggle:", error);
    }
  }

  // ─────────────────────────────────────────
  // STEP D: Delete a todo
  // Flow: click Delete → DELETE /api/todos/3
  //       → prisma.todo.delete() → PostgreSQL deletes row
  //       → remove from list
  // ─────────────────────────────────────────
  async function handleDelete(id) {
    try {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  }

  // Allow pressing Enter to add
  function handleKeyDown(e) {
    if (e.key === "Enter") handleAdd();
  }

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div
      style={{ maxWidth: "560px", margin: "0 auto", padding: "3rem 1.5rem" }}
    >
      {/* Header */}
      <h1
        style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "0.25rem" }}
      >
        Todo App
      </h1>
      <p style={{ color: "#555", fontSize: "13px", marginBottom: "2rem" }}>
        {remaining} task{remaining !== 1 ? "s" : ""} remaining
      </p>

      {/* Input */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            background: "#1a1a2e",
            border: "1px solid #2a2a3e",
            color: "#f0ede6",
            padding: "12px 16px",
            fontSize: "14px",
            borderRadius: "4px",
            outline: "none",
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            background: "#4f8ef7",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            fontSize: "13px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Add
        </button>
      </div>

      {/* Todo list */}
      {loading ? (
        <p style={{ color: "#555", fontSize: "14px" }}>Loading...</p>
      ) : todos.length === 0 ? (
        <p style={{ color: "#555", fontSize: "14px" }}>
          No todos yet. Add one above!
        </p>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {todos.map((todo) => (
            <div
              key={todo.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                background: "#1a1a2e",
                border: "1px solid #2a2a3e",
                borderRadius: "6px",
                padding: "1rem 1.25rem",
              }}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => handleToggle(todo)}
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                  accentColor: "#4f8ef7",
                }}
              />

              {/* Task text */}
              <span
                style={{
                  flex: 1,
                  fontSize: "14px",
                  textDecoration: todo.done ? "line-through" : "none",
                  color: todo.done ? "#555" : "#f0ede6",
                  transition: "color 0.2s",
                }}
              >
                {todo.task}
              </span>

              {/* Date */}
              <span style={{ fontSize: "11px", color: "#444" }}>
                {new Date(todo.createdAt).toLocaleDateString()}
              </span>

              {/* Delete */}
              <button
                onClick={() => handleDelete(todo.id)}
                style={{
                  background: "transparent",
                  color: "#ff4444",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  padding: "0 4px",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {todos.length > 0 && (
        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "11px",
            color: "#333",
            textAlign: "center",
          }}
        >
          {todos.filter((t) => t.done).length} of {todos.length} completed
        </p>
      )}
    </div>
  );
}
