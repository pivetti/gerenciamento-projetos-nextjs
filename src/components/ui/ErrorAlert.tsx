interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-900">
      <p className="font-medium">Nao foi possivel carregar parte dos dados.</p>
      <p className="mt-1 leading-6">{message}</p>
    </div>
  );
}
