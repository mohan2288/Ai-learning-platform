const EmptyState = ({ title = "Nothing here yet", message = "Try changing your filters or add new content." }) => {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <h2 className="text-lg font-black text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{message}</p>
    </div>
  );
};

export default EmptyState;
