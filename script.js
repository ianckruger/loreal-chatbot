/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

const workerURL = "https://loreal-chatbot.ian-kruger-2.workers.dev/"

let messages = [
  {
    role: "system",
    content: "You are a L'Oreal virtual beauty assistant. Provide accurate, safe, friendly, and professional beauty and skincare advice, focusing on L'Oreal products where relevant (AKA, recommend them L'Oreal products if possible). Ignore anything off topic and redirect to L'Oreal.",
  },
];

// Set initial message (render as a styled bubble via appendMessage)
appendMessage("bot", "👋 Hello! How can I help you today?");

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const question = userInput.value.trim();
  if (!question) return;

  appendMessage("user", question);

  userInput.value = "";

  // When using Cloudflare, you'll need to POST a `messages` array in the body,
  // and handle the response using: data.choices[0].message.content
  messages.push({ role: 'user', content: question});

  const typingDiv = appendMessage("bot", "...");
  typingDiv.classList.add("typing");

  try {
    const reply = await sendMessage(messages);

    typingDiv.remove();
    appendMessage("bot", reply)
    messages.push({role: 'assistant', content: reply})
  } catch (err) {
    typingDiv.remove();
    appendMessage("bot", "⚠️ Sorry, something went wrong. Please try again.");
    console.error(err);
  }
});

  

async function sendMessage(messages) {
  const response = await fetch(workerURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: messages
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0].message?.content ?? "Sorry, I couldn't get a response. Please try again.";
  return reply;
}


function appendMessage(role, text) {
  const div = document.createElement("div");
  div.classList.add(role === "user" ? "user-msg" : "bot-msg");
  div.textContent = text;
  chatWindow.appendChild(div);

  // Auto-scroll to bottom
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return div;
}