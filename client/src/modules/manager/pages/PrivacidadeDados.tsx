import { useState, type ReactNode } from 'react'

import DashboardCard from '../../../components/DashboardCard'
import ManagerLayout from './ManagerLayout'

type PrivacyInfo = {
  description: ReactNode
  icon: ReactNode
  id: string
  title: ReactNode
}

type AccordionItem = {
  content: ReactNode
  id: string
  title: ReactNode
}

const privacyInfoCards: PrivacyInfo[] = [
  {
    id: 'anonymized-data',
    icon: <PrivacyIcon />,
    title: 'Dados anonimizados',
    description: 'Gestores jamais veem dados individuais',
  },
  {
    id: 'explicit-consent',
    icon: <ConsentIcon />,
    title: <>Consentimento expl&iacute;cito</>,
    description: <>Voc&ecirc; controla seus dados a todo momento</>,
  },
  {
    id: 'lgpd',
    icon: <LegalIcon />,
    title: 'LGPD compliant',
    description: 'Total conformidade com a lei brasileira',
  },
]

const accordionItems: AccordionItem[] = [
  {
    id: 'profile-access',
    title: 'O que cada perfil pode ver',
    content:
      'Pacientes acessam seus proprios registros, psicologos visualizam dados clinicos de acompanhamento e gestores veem apenas informacoes agregadas.',
  },
  {
    id: 'anonymization',
    title: <>Como a anonimiza&ccedil;&atilde;o funciona</>,
    content:
      'Dados individuais sao agrupados e exibidos somente quando ha volume minimo suficiente para impedir identificacao de pessoas.',
  },
  {
    id: 'lgpd-compliance',
    title: 'Conformidade com a LGPD',
    content:
      'A plataforma aplica principios de finalidade, necessidade, transparencia e seguranca no tratamento de dados pessoais.',
  },
  {
    id: 'storage-retention',
    title: <>Armazenamento e reten&ccedil;&atilde;o</>,
    content:
      'Os dados sao armazenados com controles de seguranca e mantidos apenas pelo periodo necessario para a prestacao do servico.',
  },
  {
    id: 'rights-contact',
    title: <>Contato e exerc&iacute;cio de direitos</>,
    content:
      'Titulares podem solicitar informacoes, correcao, exclusao ou revisao do uso de dados pelos canais oficiais da Mentis Tech.',
  },
]

export default function PrivacidadeDados() {
  const [openItems, setOpenItems] = useState<string[]>([
    accordionItems[0].id,
  ])

  function toggleAccordion(itemId: string) {
    setOpenItems((currentItems) =>
      currentItems.includes(itemId)
        ? currentItems.filter((currentItem) => currentItem !== itemId)
        : [...currentItems, itemId],
    )
  }

  return (
    <ManagerLayout>
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
            Privacidade &amp; Dados
          </h1>
          <p className="text-sm leading-6 text-gray-500">
            Pol&iacute;ticas, controles e limites de acesso aos dados da
            plataforma.
          </p>
        </header>

        <DashboardCard className="p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-start">
            <IconCircle>
              <ShieldIcon className="h-8 w-8" />
            </IconCircle>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Seguran&ccedil;a e transpar&ecirc;ncia
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
                Privacidade &amp; Prote&ccedil;&atilde;o de Dados
              </h2>
              <p className="mt-4 max-w-4xl text-base leading-8 text-gray-600">
                A Mentis Tech foi projetada com privacidade como princ&iacute;pio
                central, n&atilde;o como funcionalidade adicional. Aqui
                voc&ecirc; entende exatamente o que acontece com seus dados.
              </p>
            </div>
          </div>
        </DashboardCard>

        <section className="space-y-5">
          <SectionHeader
            title="Princ&iacute;pios de prote&ccedil;&atilde;o"
            description="Resumo dos controles aplicados para preservar privacidade e governan&ccedil;a."
          />

          <div className="grid gap-5 md:grid-cols-3">
            {privacyInfoCards.map((info) => (
              <PrivacyInfoCard key={info.id} info={info} />
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeader
            title="Perguntas frequentes"
            description="Detalhes sobre acesso, anonimiza&ccedil;&atilde;o, reten&ccedil;&atilde;o e direitos."
          />

          <div className="space-y-4">
            {accordionItems.map((item) => (
              <PrivacyAccordionItem
                key={item.id}
                item={item}
                isOpen={openItems.includes(item.id)}
                onToggle={() => toggleAccordion(item.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </ManagerLayout>
  )
}

function SectionHeader({
  description,
  title,
}: {
  description: ReactNode
  title: ReactNode
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-gray-950">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
    </div>
  )
}

function PrivacyInfoCard({ info }: { info: PrivacyInfo }) {
  return (
    <DashboardCard className="flex h-full flex-col p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <IconCircle>{info.icon}</IconCircle>
      <h2 className="mt-5 text-lg font-semibold text-gray-950">
        {info.title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-gray-500">
        {info.description}
      </p>
    </DashboardCard>
  )
}

function PrivacyAccordionItem({
  isOpen,
  item,
  onToggle,
}: {
  isOpen: boolean
  item: AccordionItem
  onToggle: () => void
}) {
  return (
    <DashboardCard className="overflow-hidden p-0">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-gray-950">
          {item.title}
        </span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-lg font-semibold text-emerald-800 transition-transform duration-200 ${
            isOpen ? 'rotate-45' : 'rotate-0'
          }`}
        >
          +
        </span>
      </button>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0">
          <p className="border-t border-gray-100 px-5 py-4 text-sm leading-7 text-gray-600 sm:px-6 sm:py-5">
            {item.content}
          </p>
        </div>
      </div>
    </DashboardCard>
  )
}

function IconCircle({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-100">
      {children}
    </div>
  )
}

function ShieldIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3 5 6v5.5c0 4.4 2.8 7.4 7 9.5 4.2-2.1 7-5.1 7-9.5V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PrivacyIcon() {
  return <ShieldIcon className="h-6 w-6" />
}

function ConsentIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 12.5 11 15l5-6M6 4h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LegalIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4v16M6 7h12M8 7l-4 7h8L8 7Zm8 0-4 7h8l-4-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
