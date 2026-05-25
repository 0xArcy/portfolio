// --- 1. Terminal Typing Effect ---
const bootText = [
  "INIT SYSTEM...",
  "LOADING MODULES: [██████████] 100%",
  "BYPASSING SECURITY PROTOCOLS...",
  "ACCESS GRANTED.",
  " "
];

const portfolioLines = [
  "Welcome to the mainframe.",
    "> DESIGNATION: Developer",
    "> STATUS: Active",
    "> HOBBIES: N/A",
  "> Contact me at: me@arcypwn.dev",
  " ",
  "// Systems nominal. Awaiting directives..."
];

const bootDiv = document.getElementById('boot-sequence');
const mainContent = document.getElementById('main-content');
const portfolioDiv = document.getElementById('portfolio-text');

async function typeText(lines, container, speed = 30) {
  for (let i = 0; i < lines.length; i++) {
    const lineDiv = document.createElement('div');
    lineDiv.className = 'text-line';
    container.appendChild(lineDiv);

    let text = lines[i];
    if (/^\s*$/.test(text)) {
      for (let s = 0; s < text.length; s++) {
        lineDiv.innerHTML += '&nbsp;';
        await new Promise(r => setTimeout(r, speed));
      }
      await new Promise(r => setTimeout(r, 200)); 
      continue;
    }

    // detect an email in the line
    const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
    const match = text.match(emailRegex);
    if (match) {
      const email = match[0];
      const start = match.index;
      const before = text.slice(0, start);
      const after = text.slice(start + email.length);

      for (let j = 0; j < before.length; j++) {
        lineDiv.innerHTML += before.charAt(j);
        await new Promise(r => setTimeout(r, speed));
      }

      const a = document.createElement('a');
      a.className = 'email-link';
      a.href = `mailto:${email}`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      lineDiv.appendChild(a);
      for (let j = 0; j < email.length; j++) {
        a.textContent += email.charAt(j);
        await new Promise(r => setTimeout(r, speed));
      }

      for (let j = 0; j < after.length; j++) {
        lineDiv.innerHTML += after.charAt(j);
        await new Promise(r => setTimeout(r, speed));
      }
    } else {
      for (let j = 0; j < text.length; j++) {
        lineDiv.innerHTML += text.charAt(j);
        await new Promise(r => setTimeout(r, speed));
      }
    }
    await new Promise(r => setTimeout(r, 200)); 
  }
}

async function initTerminal() {
  if (!bootDiv) return;
  await typeText(bootText, bootDiv, 20);
  bootDiv.classList.add('hidden');
  if (mainContent) mainContent.classList.remove('hidden');
  if (portfolioDiv) await typeText(portfolioLines, portfolioDiv, 40);
}

initTerminal();
const charContainer = document.getElementById('character-container');
const frames = [
  `  O  \n /|===--    \n / \\`,
  `  O  \n /|===-- *  \n / \\`,
  `  O  \n /|===--  * \n / \\`,
  `  O  \n /|===--   *\n / \\`
];

let currentFrame = 0;

if (charContainer) {
  setInterval(() => {
    charContainer.innerText = frames[currentFrame];
    currentFrame = (currentFrame + 1) % frames.length;
  }, 150);

  charContainer.addEventListener('click', () => {
    if (!charContainer.classList.contains('jump-anim')) {
      charContainer.classList.add('jump-anim');
      setTimeout(() => charContainer.classList.remove('jump-anim'), 500);
    }
  });
}
