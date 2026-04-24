import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '../components/Button'
import Input from '../components/Input'
import AuthLayout from '../layouts/AuthLayout'

const profiles = [
  { id: 'patient', label: 'Paciente' },
  { id: 'psychologist', label: <>Psic&oacute;logo</> },
  { id: 'manager', label: 'Gestor' },
]

export default function Login() {
  const [selectedProfile, setSelectedProfile] = useState('patient')
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <form className="w-full max-w-[400px] space-y-8 text-left">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold leading-tight text-gray-950">
            Bem-vindo a Mentis. Fa&ccedil;a login para ver as &uacute;ltimas
            atualiza&ccedil;&otilde;es.
          </h1>
        </div>

        <div className="space-y-3">
          <span className="block text-sm font-medium text-gray-700">
            Perfil
          </span>
          <div className="flex flex-wrap gap-2">
            {profiles.map((profile) => {
              const isActive = selectedProfile === profile.id

              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => setSelectedProfile(profile.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {profile.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <Input
            label="Email"
            type="email"
            placeholder="Digite seu email"
            name="email"
            autoComplete="email"
          />
          <Input
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            name="password"
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Lembre de mim
          </label>

          <a
            href="#forgot-password"
            className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700"
          >
            Esqueci a senha
          </a>
        </div>

        <div className="space-y-3">
          <Button type="submit" variant="primary" className="w-full">
            Entrar
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => navigate('/register')}
          >
            Cadastrar
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
