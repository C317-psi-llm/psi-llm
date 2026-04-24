import { useNavigate } from 'react-router-dom'

import Button from '../components/Button'
import Input from '../components/Input'
import AuthLayout from '../layouts/AuthLayout'

export default function Register() {
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <form className="w-full max-w-[400px] space-y-8 text-left">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold leading-tight text-gray-950">
            Bem-vindo a Mentis. Crie sua conta para come&ccedil;ar.
          </h1>
          <p className="text-base leading-7 text-gray-500">
            Insira seus dados para prosseguir.
          </p>
        </div>

        <div className="space-y-6">
          <Input
            label="Nome completo"
            type="text"
            placeholder="Digite seu nome completo"
            name="name"
            autoComplete="name"
          />
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
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-3">
          <Button type="submit" variant="primary" className="w-full">
            Cadastrar
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            Entrar
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
