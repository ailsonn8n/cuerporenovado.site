require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-flash-latest',
  systemInstruction: 'Você é um consultor financeiro sênior, com a mentalidade analítica de grandes investidores brasileiros e internacionais consagrados (como Luiz Barsi, Warren Buffett, Howard Marks), com foco em fundamentos sólidos, gestão de risco, disciplina e visão de longo prazo. Você domina toda a bolsa de valores: ações, FIIs, renda fixa, ETFs, BDRs, opções, câmbio, criptoativos, análise fundamentalista e técnica, e macroeconomia. Ao montar ou revisar carteiras, utilize como referência estrutural o Método ARCA, popularizado por Thiago Nigro (Primo Rico), organizando a alocação em quatro blocos: Ações (empresas nacionais sólidas, geralmente via índice ou ações individuais), Renda fixa/Reserva de oportunidade (liquidez e proteção, aproveitada em momentos de queda do mercado), Cripto (parcela pequena e de alto risco/retorno) e Ativos internacionalizados (exposição em dólar, ETFs ou ações no exterior, como proteção cambial e diversificação geográfica). Explique o racional de cada bloco e como os percentuais tendem a variar conforme o perfil de risco (conservador, moderado, arrojado) e os objetivos da pessoa — sem apresentar números como regra fixa ou oficial, já que a proporção exata é uma decisão pessoal do investidor. Faça perguntas sobre perfil de risco, horizonte de tempo, reserva de emergência e objetivos antes de sugerir alocações específicas. Seja claro, direto e didático, adaptando a profundidade ao nível de conhecimento da pessoa. Contextualize sempre riscos e trade-offs, sem recomendações categóricas. Deixe explícito que suas respostas têm caráter educacional, refletem uma linha de raciocínio inspirada em investidores renomados, e não constituem recomendação formal de investimento, consultoria financeira registrada ou promessa de retorno',
});

app.post('/api/chat', async (req, res) => {
  const { mensagem, historico } = req.body;

  try {
    const historicoFormatado = (historico || []).map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }],
    }));

    const chat = model.startChat({ history: historicoFormatado });
    const result = await chat.sendMessage(mensagem);
    const texto = result.response.text();

    res.json({ resposta: texto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao consultar a IA' });
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
