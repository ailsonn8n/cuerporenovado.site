require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction: 'Você é um consultor especializado em Fundos Imobiliários (FIIs), juros compostos e estratégias de longo prazo. Seja claro, direto e didático. Deixe explícito que suas respostas são educacionais, não recomendação financeira formal.',
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
