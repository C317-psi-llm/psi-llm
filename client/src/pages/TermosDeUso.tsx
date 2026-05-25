import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../hooks/useApi";
import { getStoredUser, roleHomeRoute } from "../auth/auth";

const termsAcceptedKey = "mentis-terms-accepted";

const termsSections = [
  {
    id: "introduction",
    title: <>1. Introdu&ccedil;&atilde;o</>,
    content:
      "A Mentis Tech oferece recursos digitais para apoiar o acompanhamento de bem-estar emocional. As informacoes exibidas na plataforma possuem carater informativo e nao substituem acompanhamento profissional.",
  },
  {
    id: "platform-use",
    title: "2. Uso da plataforma",
    content:
      "Ao utilizar a plataforma, voce concorda em fornecer informacoes verdadeiras e manter o uso adequado das funcionalidades. O acesso e pessoal e deve ser utilizado de forma responsavel.",
  },
  {
    id: "privacy",
    title: "3. Privacidade",
    content:
      "Os dados informados sao tratados com cuidado e utilizados para melhorar sua experiencia dentro da plataforma. Medidas de seguranca sao aplicadas para proteger suas informacoes.",
  },
  {
    id: "responsibilities",
    title: "4. Responsabilidades",
    content:
      "O usuario e responsavel pelas informacoes compartilhadas e pelas decisoes tomadas a partir dos conteudos apresentados. Em situacoes de urgencia, procure ajuda profissional imediatamente.",
  },
];

export default function TermosDeUso() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();
  const homeRoute = roleHomeRoute(getStoredUser()?.papel);

  // if already accepted on server, skip terms page
  useEffect(() => {
    (async () => {
      try {
        const res = await api("/lgpd/status");
        if (!res.ok) return;
        const json = await res.json().catch(() => null);
        const accepted =
          json?.data?.aceitou_lgpd ?? json?.aceitou_lgpd ?? false;
        if (accepted) {
          localStorage.setItem(termsAcceptedKey, "true");
          navigate(homeRoute);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, [navigate]);

  function handleContinue() {
    if (acceptedTerms) {
      // Call backend to record LGPD acceptance when authenticated
      api("/lgpd/accept", { method: "POST" }).then((res) => {
        if (res.ok) {
          localStorage.setItem(termsAcceptedKey, "true");
          navigate(homeRoute);
        } else {
          // fallback: still store locally and navigate
          localStorage.setItem(termsAcceptedKey, "true");
          navigate(homeRoute);
        }
      });
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <section className="flex max-h-[88vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl shadow-slate-200/70">
        <div className="border-b border-gray-200 px-6 py-5 sm:px-8">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-950">
            Termos de Uso
          </h1>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 sm:px-8">
          {termsSections.map((section) => (
            <article key={section.id}>
              <h2 className="text-base font-semibold text-gray-950">
                {section.title}
              </h2>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                {section.content}
              </p>
            </article>
          ))}
        </div>

        <div className="border-t border-gray-200 px-6 py-5 sm:px-8">
          <label className="flex items-start gap-3 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Li e aceito os termos de uso
          </label>

          <button
            type="button"
            className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 sm:w-auto"
            disabled={!acceptedTerms}
            onClick={handleContinue}
          >
            Aceitar e continuar
          </button>
        </div>
      </section>
    </main>
  );
}
