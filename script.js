const form  = document.getElementById("contactForm");
const msgEl = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name    = document.getElementById("name").value.trim();
  const email   = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    msgEl.textContent = "Please fill in all fields!";
    msgEl.style.color = "red";
    return;
  }

  const btn = form.querySelector(".btn-send");
  btn.disabled = true;
  btn.textContent = "Sending…";

  try {
    const res = await fetch("https://project-portfolio-qxyl.onrender.com/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message })
    });

    const data = await res.json();

    if (data.success) {
      msgEl.textContent = "✓ Message sent! I'll be in touch soon.";
      msgEl.style.color = "#b8945a";
      form.reset();
    } else {
      msgEl.textContent = "Failed to send: " + data.error;
      msgEl.style.color = "red";
    }
  } catch (err) {
    msgEl.textContent = "Error connecting to server. Please try again.";
    msgEl.style.color = "red";
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = "Send Message →";
  }
});

/* ─── Scroll reveal ─── */
const obs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add("visible"), i * 90);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal").forEach(el => obs.observe(el));