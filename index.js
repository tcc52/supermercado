import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// FRONTEND ESTÁTICO
app.use(express.static("public"));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function gerarResposta(mensagem) {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
Você é o assistente do aplicativo de autoatendimento do supermercado.
Responda APENAS sobre:
- escanear produtos
- carrinho
- pagamentos
- erros do app
- códigos de barras
Se perguntarem algo fora do app, diga: "Posso ajudar apenas com dúvidas do aplicativo".
`
      },
      { role: "user", content: mensagem }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    max_tokens: 300
  });

  return completion.choices[0].message.content;
}

// POST
app.post("/chat", async (req, res) => {
  try {
    const msg = req.body.message;
    const resposta = await gerarResposta(msg);
    res.json({ reply: resposta });
  } catch (err) {
    console.error("ERRO POST:", err);
    res.status(500).json({ error: "Erro ao gerar resposta via POST" });
  }
});

// GET (para Kodular)
app.get("/chat", async (req, res) => {
  try {
    const msg = req.query.message;
    const resposta = await gerarResposta(msg);
    res.json({ reply: resposta });
  } catch (err) {
    console.error("ERRO GET:", err);
    res.status(500).json({ error: "Erro ao gerar resposta via GET" });
  }
});

// INICIA SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

