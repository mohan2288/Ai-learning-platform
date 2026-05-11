const AuthLayout = ({ children }) => {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-[1fr_420px]">
        <section className="flex flex-col justify-center px-6 py-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">AI Learning Platform</p>
          <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-6xl">
            Learn faster with guided courses, progress insight, and AI support.
          </h1>
        </section>
        <section className="flex items-center px-6 pb-12 lg:py-12">{children}</section>
      </div>
    </main>
  );
};

export default AuthLayout;
