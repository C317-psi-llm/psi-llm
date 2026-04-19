-- Empresa
CREATE TABLE IF NOT EXISTS empresa (
  id_empresa serial PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cnpj VARCHAR(18) NOT NULL,
  email_contato VARCHAR(100) NOT NULL,
  telefone VARCHAR(20),
  status VARCHAR(20) NOT NULL DEFAULT 'ativo',
  data_cadastro TIMESTAMP NOT NULL DEFAULT now()
);

-- Usuario
CREATE TABLE IF NOT EXISTS usuario (
  id_usuario serial PRIMARY KEY,
  id_empresa INT NOT NULL REFERENCES empresa(id_empresa) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  papel VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ativo',
  aceitou_lgpd BOOLEAN NOT NULL DEFAULT false,
  data_aceite TIMESTAMP,
  pontuacao_total INT DEFAULT 0,
  data_cadastro TIMESTAMP NOT NULL DEFAULT now(),
  ultimo_acesso TIMESTAMP,
  dias_acesso INT DEFAULT 0
);

-- ConversaIA
CREATE TABLE IF NOT EXISTS conversa_ia (
  id_conversa serial PRIMARY KEY,
  id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  data_inicio TIMESTAMP NOT NULL DEFAULT now(),
  data_fim TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'aberta',
  disclaimer_aceito BOOLEAN NOT NULL DEFAULT false
);

-- Mensagem
CREATE TABLE IF NOT EXISTS mensagem (
  id_mensagem serial PRIMARY KEY,
  id_conversa INT NOT NULL REFERENCES conversa_ia(id_conversa) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  remetente VARCHAR(20) NOT NULL,
  data_envio TIMESTAMP NOT NULL DEFAULT now()
);

-- Questionario
CREATE TABLE IF NOT EXISTS questionario (
  id_questionario serial PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descricao TEXT,
  estrutura_json JSON NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ativo',
  data_criacao TIMESTAMP NOT NULL DEFAULT now()
);

-- RespostaQuestionario
CREATE TABLE IF NOT EXISTS resposta_questionario (
  id_resposta_questionario serial PRIMARY KEY,
  id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  id_questionario INT NOT NULL REFERENCES questionario(id_questionario) ON DELETE CASCADE,
  respostas_json JSON NOT NULL,
  pontuacao_total DECIMAL(5,2),
  nivel_estresse INT NOT NULL,
  nivel_ansiedade INT NOT NULL,
  nivel_burnout INT NOT NULL,
  nivel_depressao INT NOT NULL,
  classificacao_geral VARCHAR(20),
  observacao_geral TEXT,
  data_resposta TIMESTAMP NOT NULL DEFAULT now()
);

-- Alerta
CREATE TABLE IF NOT EXISTS alerta (
  id_alerta serial PRIMARY KEY,
  id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  id_resposta_questionario INT REFERENCES resposta_questionario(id_resposta_questionario),
  tipo_alerta VARCHAR(50) NOT NULL,
  descricao TEXT,
  nivel_gravidade VARCHAR(20) NOT NULL,
  data_geracao TIMESTAMP NOT NULL DEFAULT now(),
  status VARCHAR(20) NOT NULL DEFAULT 'ativo'
);

-- Insight
CREATE TABLE IF NOT EXISTS insight (
  id_insight serial PRIMARY KEY,
  id_usuario_destino INT NOT NULL REFERENCES usuario(id_usuario),
  id_resposta_questionario INT NOT NULL REFERENCES resposta_questionario(id_resposta_questionario),
  id_psicologo_responsavel INT REFERENCES usuario(id_usuario),
  titulo VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL,
  tipo VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente',
  data_criacao TIMESTAMP NOT NULL DEFAULT now(),
  data_validacao TIMESTAMP
);

