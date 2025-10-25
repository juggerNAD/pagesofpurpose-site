/* Basic interactions:
   - mobile nav toggle
   - smooth scroll for nav links
   - rotating testimonials
   - Web3Forms AJAX submit (stay on page + show success)
*/

document.addEventListener("DOMContentLoaded", function () {

  // Mobile nav toggle
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  navToggle && navToggle.addEventListener("click", () => {
    if (nav.style.display === "flex") nav.style.display = "none";
    else nav.style.display = "flex";
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Rotating testimonials
  (function rotateTestimonials() {
    const blocks = document.querySelectorAll(".testimonial");
    const clientLabel = document.getElementById("testimonial-client");
    if (!blocks.length || !clientLabel) return;
    let idx = 0;
    const update = () => {
      blocks.forEach((b, i) => b.classList.toggle("active", i === idx));
      const active = blocks[idx];
      clientLabel.textContent = active.getAttribute("data-client") || "";
      idx = (idx + 1) % blocks.length;
    };
    update();
    setInterval(update, 4500); // change every 4.5 seconds
  })();

  // Contact form (Web3Forms) using fetch so the page stays on same screen
  const form = document.getElementById("contactForm");
  const successBox = document.getElementById("formSuccess");
  const errorBox = document.getElementById("formError");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // hide alerts
      successBox.hidden = true;
      errorBox.hidden = true;

      const url = "https://api.web3forms.com/submit";
      const formData = new FormData(form);

      // Provide a small UX moment (disable button)
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      fetch(url, {
        method: "POST",
        body: formData
      })
      .then(async (res) => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";

        if (res.ok) {
          // show success alert
          successBox.hidden = false;
          errorBox.hidden = true;
          form.reset();

          // optionally, clear after a few seconds
          setTimeout(() => {
            successBox.hidden = true;
          }, 6000);
        } else {
          // try to read response text for debugging
          let data;
          try { data = await res.json(); } catch (_) { data = await res.text(); }
          console.error("Web3Forms error:", data);
          successBox.hidden = true;
          errorBox.hidden = false;
        }
      }).catch((err) => {
        console.error("Fetch error:", err);
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
        successBox.hidden = true;
        errorBox.hidden = false;
      });
    });
  }

  // footer year
  const y = new Date().getFullYear();
  document.getElementById("year") && (document.getElementById("year").textContent = y);
});
