export function LoadingState() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-32 animate-pulse rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(243,232,255,0.68))] shadow-[0_20px_50px_rgba(74,16,135,0.08)] backdrop-blur"
        />
      ))}
    </div>
  );
}
