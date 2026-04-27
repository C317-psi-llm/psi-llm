import React from 'react'
import '@testing-library/jest-dom/vitest'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Button from '../Button'
import Input from '../Input'
import AnswerButton from '../AnswerButton'
import ChatInput from '../ChatInput'
import MessageBubble from '../MessageBubble'

describe('Componentes reutilizáveis do frontend', () => {
  it('renderiza o texto do Button e executa o clique', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Entrar</Button>)

    const button = screen.getByRole('button', { name: /entrar/i })

    expect(button).toBeInTheDocument()

    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renderiza o Input com label e placeholder', () => {
    render(
      <Input
        label="Nome"
        placeholder="Digite seu nome"
      />
    )

    expect(screen.getByText('Nome')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite seu nome')).toBeInTheDocument()
  })

  it('executa o onClick do AnswerButton ao selecionar uma resposta', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(
      <AnswerButton onClick={handleClick}>
        Resposta 1
      </AnswerButton>
    )

    const answerButton = screen.getByRole('button', { name: /resposta 1/i })

    await user.click(answerButton)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renderiza uma mensagem do usuário no MessageBubble', () => {
    render(
      <MessageBubble sender="user">
        Estou me sentindo melhor hoje.
      </MessageBubble>
    )

    expect(screen.getByText('Estou me sentindo melhor hoje.')).toBeInTheDocument()
  })

  it('permite digitar e enviar uma mensagem pelo ChatInput', async () => {
  const user = userEvent.setup()
  const handleSubmit = vi.fn()

  function ChatInputTestWrapper() {
    const [message, setMessage] = React.useState('')

    return (
      <ChatInput
        value={message}
        onChange={setMessage}
        onSubmit={handleSubmit}
      />
    )
  }

  render(<ChatInputTestWrapper />)

  const input = screen.getByPlaceholderText('Digite sua mensagem')
  const sendButton = screen.getByRole('button', { name: /enviar/i })

  await user.type(input, 'Olá')
  await user.click(sendButton)

  expect(handleSubmit).toHaveBeenCalledTimes(1)
  })
})