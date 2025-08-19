"use client";

import { useState } from "react";
import { login, register } from "@/client"; // adjust import path if needed
import type { LoginResponse } from "@/client"; // type from your OpenAPI client

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: LoginResponse) => void;
}

export default function AuthModal({ onClose, onLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // 🔑 Login with API client
        const resp = await login({
          body: { username: email, password },
        });
        onLogin(resp.data!);
      } else {
        // 📝 Register with API client
        const resp = await register({
          body: { email, password },
        });
        onLogin(resp.data!);
      }

      onClose();
    } catch (err: any) {
      console.error("Auth error:", err);
      setError("Falha ao autenticar. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">
          {isLogin ? "Iniciar Sessão" : "Criar Conta"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / Username field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isLogin ? "Utilizador" : "Email"}
            </label>
            <input
              type={isLogin ? "text" : "email"}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Palavra-passe
            </label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading
              ? "Aguarde..."
              : isLogin
              ? "Entrar"
              : "Registar"}
          </button>
        </form>

        {/* Switch login/register */}
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          {isLogin ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Registar" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  );
}
