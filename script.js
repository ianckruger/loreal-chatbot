/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

const workerURL = "https://loreal-chatbot.ian-kruger-2.workers.dev/"

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

/* Handle form submit */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // When using Cloudflare, you'll need to POST a `messages` array in the body,
  // and handle the response using: data.choices[0].message.content

  // Show message
  chatWindow.innerHTML = "Connect to the OpenAI API for a response!";
});


async function sendMessage(userMessage) {
  const response = await fetch(workerURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: "You are a L'Oreal virtual beauty assistant. Provide accurate, safe, friendly, and professional beauty and skincare advice, focusing on L'Oreal products where relevant (AKA, recommend them L'Oreal products if possible).",
        },
        { role: "user", content: userMessage },
      ],
    }),
  });

  const data = await response.json();
  const reply = data.choices?.[0].message?.content ?? "Sorry, I couldn't get a response. Please try again.";
  return reply;
}