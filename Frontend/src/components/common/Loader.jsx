const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-500">
      <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      {text}
    </div>
  );
};

export default Loader;
