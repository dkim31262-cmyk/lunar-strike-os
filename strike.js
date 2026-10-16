const LOCATE = [
  ["motion", "In motion"],
  ["threshold", "At a threshold"],
  ["dark", "In the dark"],
  ["still", "Holding still"],
];

const FRAMES = {
  motion: "You are already moving. Name the direction. Do not let anyone finish it.",
  threshold: "You are at a threshold. The next true sentence is the one you will stand on.",
  dark: "You are in the dark. The next true sentence is a small light you can hold.",
  still: "You are holding still. The next true sentence does not rush you.",
};

const root = document.querySelector("#ritual");
const doors = document.querySelector("#doors");

fetch("./gas.json")
  .then((r) => r.json())
  .then((gas) => {
    doors.innerHTML = gas.doors
      .map(
        (d) => `<article>
          <p class="kicker">${d.id}</p>
          <h2>${d.owns.split(".")[0]}</h2>
          <p>${d.owns}</p>
          <p><a href="${d.open}">Open</a> · <a href="${d.edit}">Edit</a></p>
        </article>`,
      )
      .join("");
  })
  .catch(() => {
    doors.innerHTML = "<article><p>The map could not load. Read gas.json.</p></article>";
  });

function panel(html) {
  root.innerHTML = html;
}

document.querySelector("#begin").addEventListener("click", () => {
  panel(`<p class="kicker">01 · Fracture</p>
    <h2>Something in you has been running without asking.</h2>
    <p class="thai">Not a threat. A pause.</p>
    <div class="row"><button class="btn" type="button" id="here">I am here</button></div>`);
  document.querySelector("#here").addEventListener("click", locate);
});

function locate() {
  panel(`<p class="kicker">02 · Locate</p>
    <h2>Where are you, really?</h2>
    <p class="thai">Point to a place. This is not an identity.</p>
    <div class="choices">${LOCATE.map(([id, label]) => `<button class="choice" type="button" data-id="${id}">${label}</button>`).join("")}</div>
    <div class="row"><button class="btn" type="button" id="next" disabled>Continue</button></div>`);
  let picked = "";
  root.querySelectorAll(".choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      picked = btn.dataset.id;
      root.querySelectorAll(".choice").forEach((b) => b.classList.toggle("on", b === btn));
      document.querySelector("#next").disabled = false;
    });
  });
  document.querySelector("#next").addEventListener("click", () => agency(picked));
}

function agency(picked) {
  panel(`<p class="kicker">03 · Agency</p>
    <h2>${FRAMES[picked]}</h2>
    <label class="kicker" for="sentence">The sentence is yours</label>
    <textarea id="sentence" placeholder="Write it in your language."></textarea>
    <div class="row"><button class="btn" type="button" id="mine" disabled>This is mine</button></div>`);
  const box = document.querySelector("#sentence");
  const mine = document.querySelector("#mine");
  box.addEventListener("input", () => {
    mine.disabled = !box.value.trim();
  });
  mine.addEventListener("click", () => handoff(box.value.trim()));
}

function handoff(sentence) {
  try {
    localStorage.setItem(
      "lunar-strike-os-public-trace",
      JSON.stringify({ sentence, at: Date.now() }),
    );
  } catch {
    /* the sentence still stands on the page */
  }
  panel(`<p class="kicker">05 · Hand-off</p>
    <h2>Understanding is not the destination. Standing is.</h2>
    <blockquote>${escapeHtml(sentence)}</blockquote>
    <p class="thai">Kept on this device only. Nothing was sent. Nothing is owed to the machine.</p>
    <div class="row"><a class="btn" href="#top">Return</a></div>`);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => {
    if (c === "&") return "\u0026amp;";
    if (c === "<") return "\u0026lt;";
    if (c === ">") return "\u0026gt;";
    if (c === '"') return "\u0026quot;";
    return "\u0026#39;";
  });
}
