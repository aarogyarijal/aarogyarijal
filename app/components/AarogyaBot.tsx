"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What's your background?",
  "Tell me about your skills",
  "What startups are you in?",
  "How can I contact you?",
];

export default function AarogyaBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hey! I'm Aarogya. Ask me anything about my work, skills, or background!",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping || isStreaming) return;

    const userMessage: Message = {
      id: messages.length,
      text: input.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input.trim();
    setInput("");
    setIsTyping(true);

    // Bot message ID for streaming
    const botMessageId = messages.length + 1;

    try {
      // Build conversation history for context
      const chatHistory: ChatMessage[] = messages
        .filter((msg) => msg.id > 0) // Skip initial greeting
        .map((msg) => ({
          role: msg.isBot ? "assistant" as const : "user" as const,
          content: msg.text,
        }));

      // Add the new user message
      chatHistory.push({ role: "user", content: userInput });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      // Collect all chunks first
      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      // Switch from loading to streaming mode
      setIsTyping(false);
      setIsStreaming(true);

      // Create placeholder bot message for streaming
      const botMessage: Message = {
        id: botMessageId,
        text: "",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);

      // Display text word by word at reading pace
      const words = fullText.split(/(\s+)/); // Split but keep whitespace
      let displayedText = "";

      for (const word of words) {
        displayedText += word;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, text: displayedText }
              : msg
          )
        );
        // Delay based on word length for natural reading pace
        // ~200-250 words per minute average reading speed
        const delay = word.trim().length > 0 ? Math.max(60, word.length * 30) : 10;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error("Chat error:", error);
      // Add error message (may not exist yet if error happened before streaming)
      setMessages((prev) => {
        const exists = prev.some((msg) => msg.id === botMessageId);
        if (exists) {
          return prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, text: "Sorry, I'm having trouble connecting right now. Feel free to reach out via email at aarogya.rijal@gmail.com!" }
              : msg
          );
        } else {
          return [...prev, {
            id: botMessageId,
            text: "Sorry, I'm having trouble connecting right now. Feel free to reach out via email at aarogya.rijal@gmail.com!",
            isBot: true,
            timestamp: new Date(),
          }];
        }
      });
    } finally {
      setIsTyping(false);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (question: string) => {
    setInput(question);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md h-[380px] w-full border border-gray-200 dark:border-zinc-800 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-zinc-800 flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
          <Bot size={18} className="text-white" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">Chat with Aarogya</h2>
          <p className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-500">Powered by AI • Ask me anything</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${msg.isBot ? "" : "flex-row-reverse"}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${msg.isBot
                  ? "bg-gradient-to-br from-green-400 to-emerald-600"
                  : "bg-gray-50 dark:bg-zinc-700"
                }`}
            >
              {msg.isBot ? (
                <Bot size={12} className="text-white" />
              ) : (
                <User size={12} className="text-zinc-900 dark:text-zinc-300" />
              )}
            </div>
            <div
              className={`max-w-[80%] px-3 py-2 rounded-lg text-xs sm:text-sm ${msg.isBot
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200"
                  : "bg-green-600 text-white whitespace-pre-wrap"
                }`}
            >
              {msg.isBot ? (
                <ReactMarkdown
                  components={{
                    // Bold text
                    strong: ({ children }) => (
                      <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{children}</strong>
                    ),
                    // Italic text
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    // Paragraphs
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    // Unordered lists
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                    ),
                    // Ordered lists
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                    ),
                    // List items
                    li: ({ children }) => (
                      <li className="ml-1">{children}</li>
                    ),
                    // Links
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 underline"
                      >
                        {children}
                      </a>
                    ),
                    // Code inline
                    code: ({ children }) => (
                      <code className="bg-zinc-100 px-1 py-0.5 rounded text-green-700 text-[11px] dark:bg-zinc-700 dark:text-green-300">
                        {children}
                      </code>
                    ),
                    // Code blocks
                    pre: ({ children }) => (
                      <pre className="bg-zinc-100 p-2 rounded my-2 overflow-x-auto text-[11px] dark:bg-zinc-700 dark:text-zinc-200">
                        {children}
                      </pre>
                    ),
                    // Headings
                    h1: ({ children }) => (
                      <h1 className="text-base font-bold mb-2 text-zinc-900 dark:text-zinc-100">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-sm font-bold mb-1 text-zinc-900 dark:text-zinc-100">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xs font-bold mb-1 text-zinc-900 dark:text-zinc-100">{children}</h3>
                    ),
                    // Blockquotes
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-green-500 pl-2 my-2 italic text-zinc-700 dark:text-zinc-400">
                        {children}
                      </blockquote>
                    ),
                    // Horizontal rule
                    hr: () => <hr className="border-gray-200 dark:border-zinc-700 my-2" />,
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
              <Bot size={12} className="text-white" />
            </div>
            <div className="bg-gray-50 dark:bg-zinc-800 px-3 py-2 rounded-lg">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-300 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-300 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-300 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-3 sm:px-4 pb-2 flex-shrink-0">
          <p className="text-[10px] text-zinc-700 dark:text-zinc-500 mb-1.5">Try asking:</p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSuggestion(q)}
                className="px-2 py-1 bg-gray-50 text-zinc-900 border border-gray-200 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-700 rounded text-[10px] sm:text-xs transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-zinc-800 flex-shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            disabled={isTyping || isStreaming}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 dark:placeholder-zinc-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping || isStreaming}
            className="px-3 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-200 disabled:dark:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
