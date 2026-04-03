import type { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Cadastro | ProjectHub",
  description: "Crie sua conta no ProjectHub.",
};

export default function RegisterPage() {
  return (
    <AuthSplitLayout
      eyebrow="Setup inicial"
      title="Comece a transformar sua gestao de projetos"
      description="Crie sua conta e tenha acesso imediato a uma operacao mais organizada, com visibilidade de equipe, cronogramas, custos e riscos."
      formTitle="Criar conta"
      formDescription="Preencha os dados abaixo para comecar."
      footerText="Ja tem uma conta?"
      footerLinkHref="/login"
      footerLinkLabel="Entrar"
    >
      <RegisterForm />
    </AuthSplitLayout>
  );
}
