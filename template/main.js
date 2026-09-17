import { createFullEditor, htmlToMarkdown } from '../src/index.js';

// Mount full-featured Feather editor with starter boilerplate
const editor = createFullEditor('#editor', {
  placeholder: "Write something inspiring, or type '/' for commands…",
  onChange: updateStats,
});

// Update word and character counts
function updateStats() {
  const text = editor.getText();
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;

  document.getElementById('word-count').textContent = `${words} word${words === 1 ? '' : 's'}`;
  document.getElementById('char-count').textContent = `${chars} character${chars === 1 ? '' : 's'}`;
}

updateStats();

// Theme toggle
const themeBtn = document.getElementById('btn-theme');
themeBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Copy HTML
document.getElementById('btn-copy-html').addEventListener('click', async () => {
  await navigator.clipboard.writeText(editor.getHtml());
  alert('HTML copied to clipboard!');
});

// Copy Markdown
document.getElementById('btn-copy-md').addEventListener('click', async () => {
  const md = htmlToMarkdown(editor.getHtml());
  await navigator.clipboard.writeText(md);
  alert('Markdown copied to clipboard!');
});
