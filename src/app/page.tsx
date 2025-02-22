"use client";

import { useChat } from "@ai-sdk/react";

export default function HomePage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col gap-4 text-white">
      <div className="flex flex-col gap-2">
        {messages.map((message) => (
          <div key={message.id}>{message.content}</div>
        ))}
      </div>
      <input
        className="rounded-md border-2 border-white p-2 text-black"
        value={input}
        onChange={handleInputChange}
      />
      <button
        className="rounded-md border-2 border-white p-2 text-white"
        onClick={handleSubmit}
      >
        Send
      </button>
    </div>
  );
}
