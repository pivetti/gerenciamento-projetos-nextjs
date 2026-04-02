import { AppShell } from "@/components/layout/AppShell";
import { LoadingState } from "@/components/ui/LoadingState";

export default function Loading() {
  return (
    <AppShell title="Carregando dados" description="Buscando informacoes mais recentes da API para montar a tela.">
      <LoadingState />
    </AppShell>
  );
}
