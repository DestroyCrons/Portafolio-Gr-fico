import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      <div className="glass-panel max-w-xl rounded-[8px] p-10">
        <p className="font-display text-sm uppercase text-cyan">404</p>
        <h1 className="mt-4 font-display text-5xl uppercase text-chrome">Lost Signal</h1>
        <p className="mt-5 text-sm leading-7 text-white/68">
          The requested frame is not in the current composition.
        </p>
        <Link
          href="/"
          className="focus-ring mt-8 inline-flex h-11 items-center justify-center rounded-[8px] border border-white/15 bg-white/10 px-5 text-sm font-semibold uppercase text-white transition hover:border-acid/70 hover:text-acid"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}

