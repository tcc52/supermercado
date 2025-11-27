const API_URL = "https://supermercado-2rnt.onrender.com"; // troque pela sua URL

function addMessage(text, sender) {
  const chat = document.getElementById("chat");
  const div = document.createElement("div");

  div.classList.add("message", sender);
  div.textContent = text;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("message");
  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await response.json();
    addMessage(data.reply, "bot");

  } catch (error) {
    addMessage("Erro ao conectar ao servidor.", "bot");
  }
}




