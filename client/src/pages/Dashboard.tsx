import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "../hooks/useApi";
import ChartCard from "../components/ChartCard";
import MetricCard from "../components/MetricCard";
import DashboardLayout from "../layouts/DashboardLayout";

const periodOptions = [
  { label: "7 dias", value: 7 },
  { label: "15 dias", value: 15 },
  { label: "30 dias", value: 30 },
];

const metricDefinitions = [
  {
    key: "estresse",
    label: "Estresse",
  },
  {
    key: "ansiedade",
    label: "Ansiedade",
  },
  {
    key: "burnout",
    label: "Burnout",
  },
  {
    key: "depressao",
    label: <>Depress&atilde;o</>,
  },
];

type DashboardEntry = {
  id_resposta_questionario: number;
  data_resposta: string;
  nivel_estresse: number;
  nivel_ansiedade: number;
  nivel_burnout: number;
  nivel_depressao: number;
  pontuacao_total?: number;
  classificacao_geral?: string;
};

export default function Dashboard() {
  const [history, setHistory] = useState<DashboardEntry[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api(
        `/questionnaires/responses/history?days=${selectedPeriod}`,
      );
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || "Erro ao carregar resultados");
      }

      const json = await res.json();
      setHistory(json?.data ?? []);
    } catch (err: any) {
      setError(err?.message ?? "Erro ao carregar resultados");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedPeriod]);

  const latestEntry = history[0];

  const metrics = useMemo(
    () =>
      metricDefinitions.map((metric) => {
        let value = 0;
        if (latestEntry) {
          switch (metric.key) {
            case "estresse":
              value = latestEntry.nivel_estresse;
              break;
            case "ansiedade":
              value = latestEntry.nivel_ansiedade;
              break;
            case "burnout":
              value = latestEntry.nivel_burnout;
              break;
            case "depressao":
              value = latestEntry.nivel_depressao;
              break;
          }
        }
        return {
          ...metric,
          value,
          accentClassName: getAccentClassName(value),
        };
      }),
    [latestEntry],
  );

  const trendData = useMemo(
    () =>
      [...history].reverse().map((entry, index) => ({
        week: formatEntryLabel(entry, index),
        estresse: entry.nivel_estresse,
        ansiedade: entry.nivel_ansiedade,
        burnout: entry.nivel_burnout,
        depressao: entry.nivel_depressao,
      })),
    [history],
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHeader
          selectedPeriod={selectedPeriod}
          onSelectPeriod={setSelectedPeriod}
        />

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.key}
              accentClassName={metric.accentClassName}
              label={metric.label}
              value={metric.value}
            />
          ))}
        </section>

        <ChartCard title={<>Tend&ecirc;ncia por Tema</>}>
          <div className="min-h-90 p-4">
            {isLoading ? (
              <div className="flex h-80 items-center justify-center text-sm text-gray-500">
                Carregando resultados...
              </div>
            ) : error ? (
              <div className="flex h-80 flex-col items-center justify-center gap-3 text-sm text-red-600">
                <p>{error}</p>
                <button
                  type="button"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                  onClick={fetchHistory}
                >
                  Tentar novamente
                </button>
              </div>
            ) : history.length === 0 ? (
              <div className="flex h-80 flex-col items-center justify-center gap-3 text-sm text-gray-500">
                <p>Nenhum resultado encontrado para o período selecionado.</p>
                <button
                  type="button"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                  onClick={() => navigate("/patient/questionario")}
                >
                  Responder questionário
                </button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={360}>
                <LineChart
                  data={trendData}
                  margin={{ top: 12, right: 24, left: 8, bottom: 16 }}
                >
                  <CartesianGrid
                    stroke="#eef2f7"
                    strokeDasharray="3 6"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    tickMargin={14}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 50, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    tickMargin={12}
                    tickFormatter={formatLevelTick}
                  />
                  <Tooltip
                    cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }}
                    contentStyle={{
                      border: "1px solid #eef2f7",
                      borderRadius: "12px",
                      boxShadow: "0 18px 40px rgb(15 23 42 / 0.10)",
                      padding: "10px 12px",
                    }}
                    labelStyle={{
                      color: "#0f172a",
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                    itemStyle={{ color: "#475569", fontSize: 12 }}
                    formatter={(value, name) => [`${value}/100`, name]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={44}
                    iconType="circle"
                    wrapperStyle={{ paddingTop: 22, fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="estresse"
                    name="Estresse"
                    stroke="#fb923c"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ansiedade"
                    name="Ansiedade"
                    stroke="#34d399"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="burnout"
                    name="Burnout"
                    stroke="#60a5fa"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="depressao"
                    name={"Depress\u00e3o"}
                    stroke="#a78bfa"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}

type PageHeaderProps = {
  selectedPeriod: number;
  onSelectPeriod: (value: number) => void;
};

function PageHeader({ selectedPeriod, onSelectPeriod }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
          Meu painel de sa&uacute;de mental
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          Veja seus níveis calculados pelo questionário mais recente.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm font-medium text-gray-500">Período</p>
        <div className="flex flex-wrap gap-2">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelectPeriod(option.value)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                selectedPeriod === option.value
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function formatEntryLabel(entry: DashboardEntry, index: number) {
  const date = new Date(entry.data_resposta);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${day}/${month}`;
}

function formatLevelTick(value: number) {
  if (value >= 100) {
    return "Alto";
  }

  if (value >= 50) {
    return "Médio";
  }

  return "Baixo";
}

function getAccentClassName(value: number) {
  if (value >= 75) return "text-rose-500";
  if (value >= 40) return "text-amber-500";
  return "text-emerald-600";
}
