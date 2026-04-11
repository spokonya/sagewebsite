export function Footer() {
  return (
    <footer className="relative z-[1] mx-auto flex w-full max-w-container flex-col justify-between gap-4 px-6 py-9 text-text-tertiary nav:flex-row nav:px-10">
      <div className="font-display text-lg font-normal lowercase tracking-[2px]">
        sage
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span>© 2026</span>
        <span>Made in Boston</span>
      </div>
    </footer>
  );
}
