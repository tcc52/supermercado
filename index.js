import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- FUNÇÃO QUE GERA A RESPOSTA ---
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
      `,
      },
      {
        role: "user",
        content: mensagem,
      }
    ],
    model: "llama-3.3-70b-versatile",
    max_tokens: 300,
    temperature: 0.2,
  });

  return completion.choices[0].message.content;
}

// --- ROTA POST ---
app.post("/chat", async (req, res) => {
  try {
    const msg = req.body.message;
    const resposta = await gerarResposta(msg);
    res.json({ reply: resposta });
  } catch (error) {
    console.error("ERRO POST:", error);
    res.status(500).json({ error: "Erro ao gerar resposta via POST" });
  }
});

// --- ROTA GET (PARA O KODULAR) ---
app.get("/chat", async (req, res) => {
  try {
    const msg = req.query.message; // pega ?message=texto
    const resposta = await gerarResposta(msg);
    res.json({ reply: resposta });
  } catch (error) {
    console.error("ERRO GET:", error);
    res.status(500).json({ error: "Erro ao gerar resposta via GET" });
  }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
