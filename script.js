// ---------------------------------------------------------------
// RSVP destination
// Paste a form endpoint here to collect responses, e.g. a free
// Formspree form: "https://formspree.io/f/xxxxxxx"
// Leave empty to test locally (responses are only logged to the console).
// ---------------------------------------------------------------
const RSVP_ENDPOINT = "";

document.documentElement.classList.add("js");

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Countdown: whole days until the wedding (local time)
const countdown = document.getElementById("countdown");
if (countdown) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((new Date(2027, 6, 16) - today) / 86400000); // months are 0-based: 6 = July
  const num = countdown.querySelector(".countdown__num");
  const label = countdown.querySelector(".countdown__label");
  if (days > 1) [num.textContent, label.textContent] = [days, "days to go!"];
  else if (days === 1) [num.textContent, label.textContent] = [1, "day to go!"];
  else if (days === 0) label.textContent = "Today's the day!";
  else label.textContent = "Just married!";
  countdown.hidden = false;
}

// Show/hide follow-up questions
const form = document.getElementById("rsvp-form");
const nameInput = document.getElementById("name");
const attendingField = document.getElementById("attending-field");
const attendingOnly = document.getElementById("attending-only");
const plusOneField = document.getElementById("plus-one-field");
const plusOneOnly = document.getElementById("plus-one-only");
const plusOneName = document.getElementById("plus_one_name");

const setOpen = (el, open) => {
  el.classList.toggle("is-collapsed", !open);
  el.inert = !open;
};

form.querySelectorAll('input[name="attending"]').forEach((r) =>
  r.addEventListener("change", () => {
    setOpen(attendingOnly, r.value === "yes");
    attendingField.classList.remove("invalid");
  })
);
form.querySelectorAll('input[name="plus_one"]').forEach((r) =>
  r.addEventListener("change", () => {
    setOpen(plusOneOnly, r.value === "yes");
    plusOneField.classList.remove("invalid");
  })
);
nameInput.addEventListener("input", () => nameInput.closest(".field").classList.remove("invalid"));
plusOneName.addEventListener("input", () => plusOneName.closest(".field").classList.remove("invalid"));

// Submit
const msg = document.getElementById("form-msg");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";

  const data = Object.fromEntries(new FormData(form));
  data.name = (data.name || "").trim();
  data.plus_one_name = (data.plus_one_name || "").trim();

  const attending = data.attending === "yes";
  const checks = [
    [nameInput.closest(".field"), !data.name, nameInput],
    [attendingField, !data.attending, form.querySelector('input[name="attending"]')],
    [plusOneField, attending && !data.plus_one, form.querySelector('input[name="plus_one"]')],
    [plusOneName.closest(".field"), attending && data.plus_one === "yes" && !data.plus_one_name, plusOneName],
  ];
  checks.forEach(([field, bad]) => field.classList.toggle("invalid", bad));
  const firstBad = checks.find(([, bad]) => bad);
  if (firstBad) return firstBad[2].focus();

  // Only send answers that apply
  if (!attending) {
    ["plus_one", "plus_one_name", "dietary", "song"].forEach((k) => delete data[k]);
    data.guests = 0;
  } else {
    if (data.plus_one !== "yes") delete data.plus_one_name;
    data.guests = data.plus_one === "yes" ? 2 : 1;
  }

  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;

  try {
    if (RSVP_ENDPOINT) {
      const res = await fetch(RSVP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(res.statusText);
    } else {
      console.info("RSVP (no endpoint set):", data);
    }
    showThanks(data);
  } catch (err) {
    msg.textContent = "Something went wrong sending your RSVP. Please try again.";
    submit.disabled = false;
  }
});

function showThanks(data) {
  const first = data.name.split(/\s+/)[0];
  const done = document.createElement("div");
  done.className = "rsvp-done rsvp-panel";
  done.innerHTML = `<p class="script"></p><p></p>`;
  const [title, text] = done.children;
  if (data.attending === "yes") {
    title.textContent = "Yay!";
    text.textContent = `Thank you, ${first}! We can't wait to celebrate with you.`;
  } else {
    title.textContent = "We'll miss you";
    text.textContent = `Thank you for letting us know, ${first}. You'll be in our hearts.`;
  }
  form.replaceWith(done);
  done.scrollIntoView({ behavior: "smooth", block: "center" });
}
