import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { LoginHero } from "@/components/auth/login-hero";

export const metadata: Metadata = { title: "Login" };

const LoginPage = () => {
  return (
    <main className="grid min-h-svh flex-1 bg-card lg:grid-cols-2">
      <LoginHero />
      <LoginForm />
    </main>
  );
};

export default LoginPage;
