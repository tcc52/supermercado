const API_URL = "https://supermercado-2rnt.onrender.com";

function addMessage(text, sender) {
  const chat = document.getElementById("chat");

  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.innerText = text;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("message");
  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";

  const response = await fetch(API_URL + "?message=" + encodeURIComponent(msg));
  const data = await response.json();

  addMessage(data.reply, "bot");
}
