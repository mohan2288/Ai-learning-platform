import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { toast } from "react-toastify";
import { chatWithAI, generateMCQ } from "../../services/aiService";
import ChatMessage from "../../components/ai/ChatMessage";
import EmptyState from "../../components/common/EmptyState";

const getAIErrorMessage = (error, fallback) => {
  const status = error.response?.status;
  const message = error.response?.data?.message || "";
  const retryAfterSeconds = error.response?.data?.retryAfterSeconds;
  const isQuotaError =
    status === 429 ||
    message.includes("429 Too Many Requests") ||
    message.toLowerCase().includes("quota exceeded") ||
    message.includes("[GoogleGenerativeAI Error]");

  if (isQuotaError) {
    return retryAfterSeconds
      ? `AI usage limit reached. Please try again in ${retryAfterSeconds} seconds.`
      : "AI usage limit reached. Please try again shortly.";
  }

  if (message.length > 140) {
    return fallback;
  }

  return message || fallback;
};

const AIAssistant = () => {
  const [messages, setMessages] = useState([{ role: "assistant", text: "Ask me for explanations, examples, or study help." }]);
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState("React Hooks");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((current) => [...current, userMessage]);
    setInput("");

    try {
      setLoading(true);
      const { data } = await chatWithAI({ message: userMessage.text });
      setMessages((current) => [...current, data.data]);
    } catch (error) {
      toast.error(getAIErrorMessage(error, "AI chat failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const { data } = await generateMCQ({ topic, difficulty: "Beginner", count: 5 });
      setQuestions(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      toast.error(getAIErrorMessage(error, "MCQ generation failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 sm:p-6 lg:grid-cols-[1fr_420px] lg:p-8">
      <section className="flex min-h-[70vh] flex-col rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h1 className="text-2xl font-black">AI Learning Assistant</h1>
          <p className="mt-1 text-sm text-slate-500">Get explanations, examples, and study direction.</p>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {messages.map((message, index) => (
            <ChatMessage key={`${message.role}-${index}`} message={message} />
          ))}
          {loading && <p className="text-sm font-semibold text-slate-400">Thinking...</p>}
        </div>
        <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-100 p-4">
          <input className="flex-1 rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask AI..." />
          <button className="rounded-lg bg-blue-600 px-4 text-white" aria-label="Send"><FiSend /></button>
        </form>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-black">MCQ Generator</h2>
        <label className="mt-4 block text-sm font-semibold">
          Topic
          <input className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" value={topic} onChange={(event) => setTopic(event.target.value)} />
        </label>
        <button onClick={handleGenerate} className="mt-4 w-full rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white">Generate MCQs</button>
        <div className="mt-5 space-y-4">
          {questions.length === 0 && <EmptyState title="No quiz generated" message="Enter a topic and generate MCQs with answers and explanations." />}
          {questions.map((question, index) => (
            <article key={`${question.question}-${index}`} className="rounded-lg border border-slate-200 p-4">
              <h3 className="font-bold">{index + 1}. {question.question}</h3>
              <div className="mt-3 space-y-2">
                {question.options?.map((option) => (
                  <p key={option} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">{option}</p>
                ))}
              </div>
              <p className="mt-3 text-sm font-bold text-emerald-700">Answer: {question.correctAnswer}</p>
              <p className="mt-1 text-sm text-slate-500">{question.explanation}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AIAssistant;
