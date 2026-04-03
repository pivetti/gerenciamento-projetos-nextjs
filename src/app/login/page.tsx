import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | ProjectHub",
  description: "Acesse o ProjectHub com seu e-mail e senha.",
};

export default function LoginPage() {
  return (
    <AuthSplitLayout
      eyebrow="Painel corporativo"
      title="Gerencie seus projetos com excelencia"
      description="Plataforma corporativa completa para planejamento, execucao e acompanhamento de projetos com visibilidade total sobre custos, recursos e riscos."
      formTitle="Bem-vindo de volta"
      formDescription="Entre com suas credenciais para acessar o sistema."
      footerText="Nao tem uma conta?"
      footerLinkHref="/cadastro"
      footerLinkLabel="Criar conta"
    >
      <LoginForm />
    </AuthSplitLayout>
  );
}
