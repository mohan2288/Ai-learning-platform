const ProgressBar = ({ value = 0 }) => {
  const progress = Math.min(Math.max(Number(value) || 0, 0), 100);

  return (
    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
    </div>
  );
};

export default ProgressBar;
