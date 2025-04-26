import { useState, useRef, FormEvent } from "react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const content = inputRef.current!.value.trim();
    if (!content) return;

    // optimistic UI
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    inputRef.current!.value = "";

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: next }),
      headers: { "Content-Type": "application/json" },
    });
    const data = (await res.json()) as Msg;

    setMessages((m) => [...m, data]);
  }

  return (
    <div className="flex h-full flex-col rounded-lg border p-4 dark:border-zinc-600">
      <h2 className="mb-2 text-lg font-semibold">Ask&nbsp;the&nbsp;AI 🤖</h2>

      <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto pr-2">
        {messages.map((m, i) => (
          <p
            key={i}
            className={
              m.role === "user"
                ? "text-right text-accent-2"
                : "rounded bg-zinc-200 p-2 dark:bg-zinc-700"
            }
          >
            {m.content}
          </p>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          ref={inputRef}
          className="w-full rounded border px-2 py-1 dark:bg-zinc-800"
          placeholder="Type a question…"
        />
        <button
          type="submit"
          className="rounded bg-accent px-3 py-1 text-white dark:bg-accent-2"
        >
          Send
        </button>
      </form>
    </div>
  );
}
