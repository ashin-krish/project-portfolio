const form = document.getElementById("contactForm");
const msgEl = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    msgEl.textContent = "Please fill in all fields!";
    msgEl.style.color = "red";
    return;
  }

  try {
    const res = await fetch("https://<YOUR_RENDER_BACKEND_URL>/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, message })
    });

    const data = await res.json();

    if (data.success) {
      msgEl.textContent = "Message sent successfully!";
      msgEl.style.color = "#00ffff";
      form.reset();
    } else {
      msgEl.textContent = "Failed to send message: " + data.error;
      msgEl.style.color = "red";
    }
  } catch (err) {
    msgEl.textContent = "Error connecting to server!";
    msgEl.style.color = "red";
    console.error(err);
  }
});