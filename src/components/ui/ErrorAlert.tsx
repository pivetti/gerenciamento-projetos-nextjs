interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="rounded-[24px] border border-rose-200/80 bg-[linear-gradient(180deg,rgba(255,241,242,0.96),rgba(255,255,255,0.88))] px-5 py-4 text-sm text-rose-900 shadow-[0_18px_45px_rgba(190,24,93,0.08)] backdrop-blur">
      <p className="font-medium">Nao foi possivel carregar parte dos dados.</p>
      <p className="mt-1 leading-6">{message}</p>
    </div>
  );
}
