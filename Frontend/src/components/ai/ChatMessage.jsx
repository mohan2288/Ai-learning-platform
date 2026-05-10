const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`max-w-[85%] rounded-lg px-4 py-3 text-sm ${isUser ? "ml-auto bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}>
      {message.text}
    </div>
  );
};

export default ChatMessage;
