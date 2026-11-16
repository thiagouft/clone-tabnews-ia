import { Suspense } from "react";
import Confetti from "./confetti";

// O total de conteúdos não precisa ser em tempo real: a página é gerada
// estaticamente e regenerada em segundo plano a cada 60 segundos (ISR).
export const revalidate = 60;

async function getTotalContents() {
  try {
    const response = await fetch(
      "https://www.tabnews.com.br/api/v1/contents?per_page=1&strategy=new",
      {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(3000),
      },
    );

    if (!response.ok) return null;

    const total = Number(response.headers.get("x-pagination-total-rows"));
    return Number.isFinite(total) ? total : null;
  } catch {
    return null;
  }
}

async function TotalContents() {
  const totalContents = await getTotalContents();

  if (totalContents === null) {
    return "Não foi possível carregar o total de conteúdos publicados.";
  }

  return (
    <>
      <strong>{totalContents.toLocaleString("pt-BR")}</strong> conteúdos
      publicados no TabNews
    </>
  );
}

export default function Home() {
  return (
    <main>
      <Confetti />
      <h1>🚧 Em Construção</h1>
      <p>
        Estamos neste exato momento reconstruindo o TabNews, um lugar na
        internet para quem trabalha com tecnologia e precisa consumir conteúdos
        com valor concreto.
      </p>
      <p className="total">
        <Suspense fallback="Carregando total de conteúdos publicados…">
          <TotalContents />
        </Suspense>
      </p>
      <a href="https://www.tabnews.com.br">Acesse o TabNews oficial →</a>
    </main>
  );
}
