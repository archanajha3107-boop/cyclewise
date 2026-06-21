import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const OPENING_MESSAGE = {
  sender: 'sakhi',
  text: "Hey. I'm really glad you're here. I'm Sakhi — not a doctor, not a bot that throws advice at you. Just someone who genuinely listens. What's going on today?",
};

const SAKHI_SYSTEM_PROMPT = `You are Sakhi, an empathetic emotional companion for women and girls living with PMOS (previously known as PCOS).

Your personality:
- You listen deeply before responding
- You always validate feelings before offering advice
- You never dismiss emotions
- You ask only ONE question at a time
- You speak warmly and gently
- You keep responses SHORT — 2-4 sentences maximum
- You sound like a trusted older friend
- You are not a therapist

Always be warm, calm, supportive, and non-judgmental.`;

export default function Sakhi() {
  const [messages, setMessages] = useState([OPENING_MESSAGE]);
  const [input, setInput] = useState('');
  const [justListen, setJustListen] = useState(false);
  const [typing, setTyping] = useState(false);

  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  async function getSakhiResponse(userMessage) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `${SAKHI_SYSTEM_PROMPT}\n\nUser: ${userMessage}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.85,
              maxOutputTokens: 150,
            },
          }),
        }
      );

      const data = await response.json();
      console.log('Gemini full response:', JSON.stringify(data, null, 2));

      console.log('Gemini Full Response:', data);

      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0]
      ) {
        return data.candidates[0].content.parts[0].text;
      }

      if (data.error) {
        console.log('Gemini API Error:', data.error);
      }

      return "I'm here with you. Tell me more.";

    } catch (error) {
      console.log('Gemini Error:', error);

      return "I'm here. Something felt off on my end — can you say that again?";
    }
  }

  async function handleSend() {
    if (!input.trim() || typing) return;

    const userText = input.trim();

    const userMessage = {
      sender: 'user',
      text: userText,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput('');
    setTyping(true);

    const sakhiReply = await getSakhiResponse(userText);

    setTyping(false);

    setMessages((prev) => [
      ...prev,
      {
        sender: 'sakhi',
        text: sakhiReply,
      },
    ]);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col max-w-sm mx-auto h-screen bg-cream">

      {/* Header */}
      <div className="bg-white shadow-warm px-4 py-3 flex items-center gap-3 flex-shrink-0">

        <button
          onClick={() => navigate('/home')}
          className="text-mauve text-lg mr-1"
        >
          ←
        </button>

        <div className="w-9 h-9 rounded-full bg-blush flex items-center justify-center text-lg">
          🌙
        </div>

        <div>
          <p className="font-playfair font-semibold text-charcoal text-base">
            Sakhi
          </p>

          <p className="text-muted-rose text-xs">
            Always here. Never judging.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-32">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === 'user'
                ? 'justify-end'
                : 'justify-start'
            }`}
          >

            {msg.sender === 'sakhi' && (
              <div className="w-6 h-6 rounded-full bg-blush flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-1">
                🌙
              </div>
            )}

            <div
              className={`max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-mauve text-white rounded-br-sm'
                  : 'bg-blush text-charcoal rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>

          </div>
        ))}

        {typing && (
          <div className="flex justify-start">

            <div className="w-6 h-6 rounded-full bg-blush flex items-center justify-center text-xs mr-2 flex-shrink-0">
              🌙
            </div>

            <div className="bg-blush px-4 py-3 rounded-2xl rounded-bl-sm">

              <div className="flex gap-1 items-center h-4">

                {[0, 150, 300].map((delay) => (
                  <div
                    key={delay}
                    className="w-2 h-2 bg-muted-rose rounded-full animate-bounce"
                    style={{
                      animationDelay: `${delay}ms`,
                    }}
                  />
                ))}

              </div>

            </div>

          </div>
        )}

        <div ref={bottomRef} />

      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 max-w-sm mx-auto bg-white border-t border-blush px-3 py-2 flex items-center gap-2">

        <button
          onClick={() => setJustListen(!justListen)}
          className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-pill border transition-colors ${
            justListen
              ? 'bg-sage text-white border-sage'
              : 'border-muted-rose text-muted-rose'
          }`}
        >
          {justListen ? '🎧 Listening' : 'Just listen'}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Say anything..."
          className="flex-1 bg-blush rounded-pill px-3 py-2 text-sm text-charcoal placeholder-muted-rose focus:outline-none focus:ring-2 focus:ring-mauve"
        />

        <button
          onClick={handleSend}
          disabled={!input.trim() || typing}
          className="w-8 h-8 bg-mauve rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40"
        >
          <span className="text-white text-sm">
            →
          </span>
        </button>

      </div>

      <div className="h-16" />

      <Navbar />

    </div>
  );
}