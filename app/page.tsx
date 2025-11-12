"use client";
import React, { useState } from "react";

interface ProcessResponse {
  ok: boolean;
  press_release?: string;
  title_options?: string[];
  error?: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [output, setOutput] = useState("");
  const [titles, setTitles] = useState<string[]>([]);

  const run = async () => {
    if (!url.trim()) {
      setStatus("Please enter a YouTube URL.");
      return;
    }

    setStatus("⏳ Running pipeline… this can take several minutes.");
    setOutput("");
    setTitles([]);

    try {
      // Consider calling your Next.js route: fetch("/api/process", {...})
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, user_prompt: prompt }),
      });

      const data: ProcessResponse = await res.json();

      if (!res.ok || !data.ok) {
        setStatus(`❌ Error: ${data.error || `status ${res.status}`}`);
        return;
      }

      setOutput(data.press_release || "");
      setTitles(data.title_options || []);
      setStatus("✅ Done.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(`⚠️ Network error: ${msg}`);
    }
  };

  const clearAll = () => {
    setUrl("");
    setPrompt("");
    setOutput("");
    setTitles([]);
    setStatus(null);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "32px auto",
        padding: "0 16px",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: 8 }}>AI Press Release Tool</h1>
      <p style={{ color: "#64748b", marginTop: 0 }}>
      </p>

      {/* Input Section */}
      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          margin: "16px 0",
        }}
      >
        <label style={{ fontWeight: 600, display: "block", marginBottom: 6 }}>
          YouTube URL
        </label>
        <input
          value={url}
          onChange={handleUrlChange}
          placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #cbd5e1",
          }}
        />

        <label
          style={{
            fontWeight: 600,
            display: "block",
            margin: "12px 0 6px",
          }}
        >
          Optional prompt / guidance
        </label>
        <textarea
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Tone, audience, must-include points…"
          style={{
            width: "100%",
            minHeight: 140,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #cbd5e1",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 12,
            alignItems: "end",
            marginTop: 12,
          }}
        >
          <button
            onClick={run}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              fontWeight: 600,
              border: "1px solid #cbd5e1",
            }}
          >
            Run Pipeline
          </button>
          <button
            onClick={clearAll}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #cbd5e1",
            }}
          >
            Clear
          </button>
        </div>

        <div
          style={{
            color: status?.startsWith("Error")
              ? "#dc2626"
              : status?.startsWith("⚠️")
              ? "#f59e0b"
              : "#16a34a",
            marginTop: 10,
          }}
        >
          {status}
        </div>
      </section>

      {/* Suggested Headlines */}
      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <h3 style={{ marginTop: 0 }}>Suggested Headlines</h3>

        {titles.length === 0 ? (
          <p style={{ color: "#64748b", margin: 0 }}>
            Headlines will appear here after you run the pipeline.
          </p>
        ) : (
          <ul
            style={{
              paddingLeft: 20,
              color: "#0f172a",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {titles.map((title, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                {title}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Press Release */}
      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <h3 style={{ marginTop: 0 }}>Press Release</h3>
        <textarea
          readOnly
          value={output}
          placeholder="Press release will appear here…"
          style={{
            width: "100%",
            minHeight: 260,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #cbd5e1",
          }}
        />
      </section>
    </main>
  );
}
