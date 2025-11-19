import { useState, KeyboardEvent, useEffect, useMemo } from "react";

import { useChatService } from "../hooks/useChatService";
import type { PictogramSuggestion, ChatResponsePayload } from "../types/chat";

interface Message {
  id: string;
  text: string;
  sent: boolean;
  time: string;
  pictograms?: PictogramSuggestion[];
  intent?: string;
  confidence?: number;
  tone?: string;
  pipeline?: string;
}

interface ChatAreaProps {
  friendName: string;
}

const initialMessages: Record<string, Message[]> = {
  Ana: [
    { id: "1", text: "¡Hola! ¿Cómo estás?", sent: false, time: "10:30 AM" },
    { id: "2", text: "¡Muy bien! ¿Y tú?", sent: true, time: "10:32 AM" },
    { id: "3", text: "¡Es mi cumpleaños!", sent: false, time: "10:35 AM" },
  ],
  Carlos: [
    { id: "1", text: "¿Jugamos?", sent: false, time: "11:00 AM" },
  ],
  María: [
    { id: "1", text: "Mira este pictograma...", sent: false, time: "09:15 AM" },
  ],
};

const pictograms = ["😊", "❤️", "🎉", "🌈", "🦄", "🎈", "⭐", "🎨"];

const ChatArea = ({ friendName }: ChatAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const { sessionId, sendMessage } = useChatService();

  useEffect(() => {
    setMessages(initialMessages[friendName] || []);
  }, [friendName]);

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")} ${
      now.getHours() >= 12 ? "PM" : "AM"
    }`;
  };

  const sendMessage = async () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputValue,
        sent: true,
        time: getCurrentTime(),
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      const currentInput = inputValue;
      setInputValue("");
      setIsLoading(true);

      try {
        if (aiEnabled) {
          // Llamar a la API de IA
          // Detectar si estamos en producción (Vercel) o desarrollo
          const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
          const apiUrl = isProduction 
            ? '/api/chat'  // URL relativa para Vercel (mismo dominio)
            : 'http://127.0.0.1:8000/chat';  // URL local
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: currentInput,
              include_pictos: true
            })
          });

          if (response.ok) {
            const aiData = await response.json();
            
            const aiReply: Message = {
              id: Date.now().toString(),
              text: aiData.response,
              sent: false,
              time: getCurrentTime(),
              intent: aiData.decided_intent,
              confidence: aiData.best_prob,
              pictograms: aiData.pictos ? aiData.pictos.join(' ') : undefined,
            };
            setMessages(prevMessages => [...prevMessages, aiReply]);
          } else {
            throw new Error('Error en la API');
          }
        } else {
          // Respuesta simple sin IA
          const replies = [
            "¡Qué genial!",
            "Entendido 😊",
            "¡Me parece una gran idea!",
            "Cuéntame más...",
            "👍",
            "Jajaja, ¡qué divertido!",
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];

          const friendReply: Message = {
            id: Date.now().toString(),
            text: randomReply,
            sent: false,
            time: getCurrentTime(),
          };
          setMessages(prevMessages => [...prevMessages, friendReply]);
        }
      } catch (error) {
        console.error('Error llamando a la API:', error);
        // Fallback a respuesta simple
        const fallbackReply: Message = {
          id: Date.now().toString(),
          text: "Lo siento, no pude procesar tu mensaje. ¿Puedes intentarlo de nuevo?",
          sent: false,
          time: getCurrentTime(),
        };
        setMessages(prevMessages => [...prevMessages, fallbackReply]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const addPictogram = (pictogram: string) => {
    setInputValue((prev) => prev + pictogram);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const getFriendAvatar = (name: string) => {
    const avatars: Record<string, string> = { Ana: "🌸", Carlos: "🚀", María: "🦄" };
    return avatars[name] || "👤";
  };

  return (
    <div className="chat-area">
      <div className="chat-header">
        <div className="chat-friend-info">
          <div className="chat-friend-avatar">{getFriendAvatar(friendName)}</div>
          <div>
            <h3>{friendName}</h3>
            <span className="chat-friend-status">
              <span className="status-dot"></span>
              {aiEnabled ? "IA Activa" : "Modo Simple"}
            </span>
          </div>
        </div>
        <div className="ai-controls">
          <button 
            className={`ai-toggle ${aiEnabled ? 'active' : ''}`}
            onClick={() => setAiEnabled(!aiEnabled)}
            title={aiEnabled ? "Desactivar IA" : "Activar IA"}
          >
            🤖
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div 
            key={message.id} 
            className={`message ${message.sent ? "sent" : "received"}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {!message.sent && <div className="message-avatar">{getFriendAvatar(friendName)}</div>}
            <div className="message-bubble">
              {message.pictograms && <div className="pictogram-message">{message.pictograms}</div>}
              <p>{message.text}</p>
              {message.intent && (
                <div className="ai-info">
                  <span className="intent-badge">{message.intent}</span>
                  {message.confidence && (
                    <span className="confidence-badge">
                      {Math.round(message.confidence * 100)}%
                    </span>
                  )}
                </div>
              )}
              <span className="message-time">{message.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <div className="pictogram-selector">
          {pictograms.map((pictogram) => (
            <button
              key={pictogram}
              className="pictogram-btn"
              onClick={() => addPictogram(pictogram)}
              title="Añadir pictograma"
            >
              {pictogram}
            </button>
          ))}
          <button className="real-pictogram-btn" title="Buscar pictogramas reales de ARASAAC">
            <i className="fas fa-images"></i>
            <span className="new-indicator">N</span>
          </button>
        </div>
        <div className="message-input-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={aiEnabled ? "Escribe tu mensaje... (IA activa)" : "Escribe tu mensaje..."}
            className="message-input"
            disabled={isLoading}
          />
          <button 
            className="send-btn" 
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
