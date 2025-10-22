"use client";

import type React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Message } from "@/types/message.type";
import { Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hallo! Wie kann ich dir helfen?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsTyping(true);

    const body = {
      messages: updatedMessages,
    };
    setInput("");

    const { message } = await fetch("/api/chatbot", {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json() as Promise<{ message: Message }>);

    const aiMessage: Message = {
      id: message.id,
      role: "assistant",
      content: message.content,
      timestamp: new Date(message.timestamp),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="flex h-[600px] w-full max-w-2xl flex-col overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            AI Assistant
          </h2>
          <p className="text-sm text-muted-foreground">Always here to help</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback
                className={
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }
              >
                {message.role === "user" ? "U" : "AI"}
              </AvatarFallback>
            </Avatar>
            <div
              className={`flex max-w-[80%] flex-col gap-1 ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-2.5 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed chat-message">
                  <Markdown>{message.content}</Markdown>
                </p>
              </div>
              <span className="px-1 text-xs text-muted-foreground">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-muted text-muted-foreground">
                AI
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-2.5">
              <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            size="icon"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
