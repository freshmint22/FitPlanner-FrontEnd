import React, { useEffect, useRef, useState } from 'react';
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

interface AIChatbotProps {
  className?: string;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ className = '' }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content:
        '¡Hola! Soy tu asistente de IA del gimnasio. ¿En qué puedo ayudarte hoy? Puedo responder sobre clases, horarios, entrenadores o cualquier duda que tengas.',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const quickQuestions = [
    '¿Cuáles son las clases de hoy?',
    '¿Quién es el entrenador del Cross Training?',
    '¿Hay cupos disponibles para Spinning?',
    '¿Cuál es la próxima clase?',
  ];

  const getAIResponse = async (userMessage: string): Promise<string> => {
    await new Promise((r) => setTimeout(r, 1000));

    const responses: Record<string, string> = {
      'clases de hoy':
        'Hoy tenemos 9 clases programadas: Funcional Full Body a las 6:00 a.m., Spinning Cardio a las 7:30 a.m., Cross Training a las 6:30 p.m., y 6 clases más distribuidas durante el día.',
      'entrenador cross training':
        'El entrenador del Cross Training es Miguel Rojas, especializado en entrenamiento de alta intensidad con más de 5 años de experiencia.',
      'cupos spinning':
        'Actualmente hay 15 cupos ocupados de 18 disponibles para la clase de Spinning Cardio a las 7:30 a.m. ¡Aún quedan 3 cupos!',
      'próxima clase':
        'La próxima clase es Funcional Full Body a las 6:00 a.m. en la Sala 2 con la entrenadora Laura Gómez.',
      'niveles disponibles':
        'Ofrecemos clases para todos los niveles: Principiante, Intermedio y Avanzado. ¿Te gustaría saber sobre alguna en particular?',
      'horarios mañana':
        'Las clases de mañana comienzan a las 6:00 a.m. con Funcional Full Body, seguido de Spinning a las 7:30 a.m. y Yoga a las 9:00 a.m.',
      'reservar clase':
        'Para reservar una clase, puedes hacerlo desde la app, en recepción o hablando directamente con el entrenador. ¿Te ayudo con alguna clase específica?',
    };

    const lowerMessage = userMessage.toLowerCase();

    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) return response;
    }

    return 'Entiendo tu consulta sobre el gimnasio. Como asistente de IA, puedo ayudarte con información sobre clases, horarios, entrenadores, reservas y disponibilidad. ¿Podrías ser más específico sobre lo que necesitas saber?';
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      content: userMessage,
      role: 'user',
      timestamp: new Date(),
    };

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsLoading(true);

    try {
      const response = await getAIResponse(userMessage);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantMsg.id ? { ...msg, content: response, isLoading: false } : msg))
      );
    } catch (err) {
      console.error('Error getting AI response:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsg.id
            ? { ...msg, content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.', isLoading: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className={`rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg shadow-black/30 overflow-hidden ${className}`}>
      <div className="border-b border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-emerald-400 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-50">Asistente IA GymPro</h3>
            <p className="text-xs text-slate-400">Responde preguntas sobre clases, horarios y más</p>
          </div>
        </div>
      </div>

      <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-slate-950/50">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                message.role === 'user' ? 'bg-gradient-to-br from-blue-600 to-indigo-600' : 'bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700'
              }`}
            >
              {message.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>

            <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user' ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30' : 'bg-slate-800/80 border border-slate-700'
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span className="text-sm text-slate-300">Escribiendo...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-slate-100 whitespace-pre-wrap">{message.content}</p>
                    <div className={`flex items-center gap-1 mt-2 ${message.role === 'user' ? 'justify-end' : ''}`}>
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-500">{formatTime(message.timestamp)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-slate-800 p-4">
        <p className="text-xs text-slate-400 mb-3">Preguntas rápidas:</p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="text-xs text-slate-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-full px-3 py-1.5 transition-colors hover:border-slate-600"
              disabled={isLoading}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-800 p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe tu pregunta sobre clases, horarios, entrenadores..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 resize-none min-h-[44px] max-h-[120px]"
              rows={1}
              disabled={isLoading}
            />
            {isLoading && (
              <div className="absolute right-3 top-3">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              </div>
            )}
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`self-end rounded-xl p-3 transition-all ${
              !input.trim() || isLoading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/20'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-blue-900/10 border border-blue-800/30">
          <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400">El asistente IA puede proporcionar información incorrecta. Verifica siempre los datos importantes directamente en recepción.</p>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
