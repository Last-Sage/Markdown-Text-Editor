// Markdown Editor Application with PWA support
class MarkdownEditor {
  constructor() {
    this.editor = document.getElementById('editor');
    this.preview = document.getElementById('preview');
    this.toolbar = document.getElementById('toolbar');
    this.status = document.getElementById('status');
    this.wordCount = document.getElementById('wordCount');
    this.charCount = document.getElementById('charCount');
    this.themeToggle = document.getElementById('themeToggle');

    // State
    this.content = '';
    this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.saveTimeout = null;
    this.parseTimeout = null;

    // Default content
    this.defaultContent = `# Welcome to Markdown Editor PWA\n\nThis is a **modern** and *fast* markdown editor that works offline!\n\n## PWA Features\n\n- 📱 Installable as native app\n- 🔄 Automatic updates\n- 🌐 Offline support\n- 📶 Network status indicator\n- 🎨 Dark/Light mode\n- 💾 Session-based storage\n\n### Code Example\n\n\`\`\`javascript\nconst hello = 'world';\nconsole.log(hello);\n\`\`\`\n\n### Links\n\n[PWA Documentation](https://web.dev/progressive-web-apps/)\n\n### Lists\n\n- Real-time preview\n- Toolbar shortcuts\n- Export options\n\n1. Type markdown\n2. See instant preview\n3. Export or copy\n\n> This app works completely offline once installed!\n\nStart editing to see the magic happen!`;

    // Toolbar buttons configuration
    this.toolbarButtons = [
      { name: 'Bold', syntax: '**', icon: 'B', wrap: true },
      { name: 'Italic', syntax: '*', icon: 'I', wrap: true },
      { name: 'Heading 1', syntax: '# ', icon: 'H1', prefix: true },
      { name: 'Heading 2', syntax: '## ', icon: 'H2', prefix: true },
      { name: 'Heading 3', syntax: '### ', icon: 'H3', prefix: true },
      { name: 'Link', syntax: '[text](url)', icon: '🔗', template: true },
      { name: 'Code Block', syntax: '```\n\n```', icon: '<>', block: true },
      { name: 'Unordered List', syntax: '- ', icon: '•', prefix: true },
      { name: 'Ordered List', syntax: '1. ', icon: '1.', prefix: true }
    ];

    this.init();
  }

  init() {
    this.setupTheme();
    this.createToolbar();
    this.loadContent();
    this.setupEventListeners();
    this.setupPWAEventListeners();
    this.updatePreview();
    this.updateCounts();
  }

  setupTheme() {
    const html = document.documentElement;
    if (this.isDark) {
      html.setAttribute('data-color-scheme', 'dark');
      this.themeToggle.textContent = '☀️';
    } else {
      html.setAttribute('data-color-scheme', 'light');
      this.themeToggle.textContent = '🌙';
    }
  }

  createToolbar() {
    this.toolbarButtons.forEach((button) => {
      const btn = document.createElement('button');
      btn.className = 'toolbar-btn';
      btn.textContent = button.icon;
      btn.title = button.name;
      btn.addEventListener('click', () => this.insertMarkdown(button));
      this.toolbar.appendChild(btn);
    });
  }

  loadContent() {
    // No persistent storage per strict rules; use default content each session
    this.content = this.defaultContent;
    this.editor.value = this.content;
  }

  setupEventListeners() {
    // Editor input
    this.editor.addEventListener('input', (e) => {
      this.content = e.target.value;
      this.debouncedUpdate();
      this.debouncedSave();
      this.updateCounts();
    });

    // Theme toggle
    this.themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Action buttons
    document.getElementById('newDoc').addEventListener('click', () => {
      this.newDocument();
    });

    document.getElementById('downloadMd').addEventListener('click', () => {
      this.downloadMarkdown();
    });

    document.getElementById('downloadHtml').addEventListener('click', () => {
      this.downloadHtml();
    });

    document.getElementById('copyHtml').addEventListener('click', () => {
      this.copyHtml();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // Handle page visibility for PWA
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // App became visible - could check for updates
        console.log('[App] App became visible');
      }
    });
  }

  setupPWAEventListeners() {
    // Listen for PWA-specific events
    window.addEventListener('pwa-action', (event) => {
      const { action } = event.detail;
      
      switch (action) {
        case 'new':
          this.newDocument();
          break;
        case 'export':
          this.downloadHtml();
          break;
        default:
          console.log('[App] Unknown PWA action:', action);
      }
    });

    // Handle app shortcuts and deep links
    this.handleDeepLinks();
  }

  handleDeepLinks() {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    
    if (action) {
      // Clear the URL parameter
      const url = new URL(window.location);
      url.searchParams.delete('action');
      window.history.replaceState({}, document.title, url.toString());
    }
  }

  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + S - Save (download)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      this.downloadMarkdown();
      return;
    }

    // Ctrl/Cmd + N - New document
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      this.newDocument();
      return;
    }

    // Ctrl/Cmd + E - Export HTML
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault();
      this.downloadHtml();
      return;
    }

    // Ctrl/Cmd + Shift + C - Copy HTML
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      this.copyHtml();
      return;
    }

    // Ctrl/Cmd + B - Bold
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      this.insertMarkdown({ name: 'Bold', syntax: '**', wrap: true });
      return;
    }

    // Ctrl/Cmd + I - Italic
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      this.insertMarkdown({ name: 'Italic', syntax: '*', wrap: true });
      return;
    }
  }

  debouncedUpdate() {
    clearTimeout(this.parseTimeout);
    this.parseTimeout = setTimeout(() => {
      this.updatePreview();
    }, 300);
  }

  debouncedSave() {
    clearTimeout(this.saveTimeout);
    this.status.textContent = 'Saving...';
    this.status.className = 'status status--warning';
    this.saveTimeout = setTimeout(() => {
      this.saveContent();
    }, 2000);
  }

  updatePreview() {
    if (typeof marked !== 'undefined') {
      try {
        // Configure marked with better options
        marked.setOptions({
          breaks: true,
          gfm: true,
          sanitize: false,
          smartypants: true
        });
        
        const html = marked.parse(this.content);
        this.preview.innerHTML = html;
      } catch (error) {
        console.error('Markdown parsing error:', error);
        this.preview.innerHTML = '<p class="error">Error parsing markdown</p>';
      }
    } else {
      // Fallback if marked.js fails to load
      this.preview.innerHTML = `<pre>${this.escapeHtml(this.content)}</pre>`;
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  updateCounts() {
    const text = this.content.trim();
    const words = text ? text.split(/\s+/).filter(word => word.length > 0).length : 0;
    const chars = this.content.length;
    this.wordCount.textContent = words;
    this.charCount.textContent = chars;
  }

  saveContent() {
    // Session-only save (no persistent storage per requirements)
    this.status.textContent = 'Saved';
    this.status.className = 'status status--success';
    
    // Auto-hide status after 2 seconds
    setTimeout(() => {
      this.status.textContent = 'Ready';
      this.status.className = 'status status--info';
    }, 2000);
  }

  insertMarkdown(button) {
    const start = this.editor.selectionStart;
    const end = this.editor.selectionEnd;
    const selectedText = this.content.substring(start, end);
    let insertion = '';
    let finalCursor = null;

    if (button.wrap) {
      insertion = `${button.syntax}${selectedText || 'text'}${button.syntax}`;
      finalCursor = selectedText ? start + insertion.length : start + button.syntax.length;
    } else if (button.prefix) {
      const before = this.content.slice(0, start);
      const lineStart = before.lastIndexOf('\n') + 1;
      insertion = button.syntax;
      this.content = this.content.slice(0, lineStart) + insertion + this.content.slice(lineStart);
      this.editor.value = this.content;
      finalCursor = start + insertion.length;
      this.editor.setSelectionRange(finalCursor, finalCursor);
      this.afterInsert();
      return;
    } else if (button.template) {
      insertion = button.syntax.replace('text', selectedText || 'text');
      finalCursor = insertion.indexOf('url');
      if (finalCursor === -1) finalCursor = start + insertion.length;
      else finalCursor = start + finalCursor;
    } else if (button.block) {
      if (selectedText) {
        insertion = `\`\`\`\n${selectedText}\n\`\`\``;
        finalCursor = start + insertion.length;
      } else {
        insertion = button.syntax;
        finalCursor = start + insertion.indexOf('\n') + 1;
      }
    } else {
      insertion = button.syntax;
      finalCursor = start + insertion.length;
    }

    this.content = this.content.slice(0, start) + insertion + this.content.slice(end);
    this.editor.value = this.content;
    this.editor.setSelectionRange(finalCursor, finalCursor);
    this.afterInsert();
  }

  afterInsert() {
    this.editor.focus();
    this.debouncedUpdate();
    this.debouncedSave();
    this.updateCounts();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    const html = document.documentElement;
    if (this.isDark) {
      html.setAttribute('data-color-scheme', 'dark');
      this.themeToggle.textContent = '☀️';
    } else {
      html.setAttribute('data-color-scheme', 'light');
      this.themeToggle.textContent = '🌙';
    }
    
    // Update manifest theme color dynamically
    this.updateThemeColor();
  }

  updateThemeColor() {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.content = this.isDark ? '#1f2121' : '#32808d';
    }
  }

  newDocument() {
    if (this.content.trim() && !confirm('Create a new document? Current content will be cleared.')) {
      return;
    }
    this.content = '';
    this.editor.value = '';
    this.editor.focus();
    this.afterInsert();
    
    // Show feedback
    this.showStatusMessage('New document created', 'success');
  }

  downloadMarkdown() {
    try {
      const blob = new Blob([this.content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.generateFilename('md');
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      this.showStatusMessage('Markdown downloaded', 'success');
    } catch (error) {
      console.error('Download failed:', error);
      this.showStatusMessage('Download failed', 'error');
    }
  }

  downloadHtml() {
    try {
      const htmlContent = this.generateCompleteHtml();
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.generateFilename('html');
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      this.showStatusMessage('HTML downloaded', 'success');
    } catch (error) {
      console.error('Download failed:', error);
      this.showStatusMessage('Download failed', 'error');
    }
  }

  generateCompleteHtml() {
    const title = this.extractTitle() || 'Markdown Document';
    const darkModeStyles = this.isDark ? this.getDarkModeStyles() : '';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(title)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      padding: 2rem 1rem;
      max-width: 800px;
      margin: auto;
      color: ${this.isDark ? '#f5f5f5' : '#1f2121'};
      background: ${this.isDark ? '#1f2121' : '#fcfcf9'};
    }
    pre {
      background: ${this.isDark ? '#262626' : '#f4f4f4'};
      padding: 1rem;
      border-radius: 5px;
      overflow-x: auto;
      border: 1px solid ${this.isDark ? '#404040' : '#e0e0e0'};
    }
    code {
      background: ${this.isDark ? '#262626' : '#f4f4f4'};
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'Berkeley Mono', ui-monospace, monospace;
    }
    blockquote {
      border-left: 4px solid ${this.isDark ? '#32b8c6' : '#32808d'};
      padding-left: 1rem;
      color: ${this.isDark ? '#a7a9a9' : '#626c6d'};
      background: ${this.isDark ? 'rgba(119, 124, 124, 0.15)' : 'rgba(94, 82, 64, 0.12)'};
      padding: 1rem;
      border-radius: 8px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1rem 0;
    }
    th, td {
      border: 1px solid ${this.isDark ? '#404040' : '#ddd'};
      padding: 0.5rem;
      text-align: left;
    }
    th {
      background: ${this.isDark ? '#262626' : '#f9f9f9'};
      font-weight: 600;
    }
    a {
      color: ${this.isDark ? '#32b8c6' : '#32808d'};
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 2rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }
    h1 { font-size: 2rem; }
    h2 { font-size: 1.75rem; }
    h3 { font-size: 1.5rem; }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
    }
    hr {
      border: none;
      border-top: 1px solid ${this.isDark ? '#404040' : '#e0e0e0'};
      margin: 2rem 0;
    }
    ${darkModeStyles}
  </style>
</head>
<body>
${this.preview.innerHTML}
</body>
</html>`;
  }

  getDarkModeStyles() {
    return `
    @media (prefers-color-scheme: dark) {
      body { background: #1f2121; color: #f5f5f5; }
      pre { background: #262626; border-color: #404040; }
      code { background: #262626; }
      th { background: #262626; }
      th, td { border-color: #404040; }
      hr { border-color: #404040; }
    }`;
  }

  extractTitle() {
    const lines = this.content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        return trimmed.substring(2).trim();
      }
    }
    return null;
  }

  generateFilename(extension) {
    const title = this.extractTitle();
    if (title) {
      const sanitized = title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      return `${sanitized}.${extension}`;
    }
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    return `markdown-${timestamp}.${extension}`;
  }

  async copyHtml() {
    try {
      await navigator.clipboard.writeText(this.preview.innerHTML);
      this.showStatusMessage('HTML copied to clipboard!', 'success');
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      // Fallback for older browsers
      this.fallbackCopyHtml();
    }
  }

  fallbackCopyHtml() {
    const textArea = document.createElement('textarea');
    textArea.value = this.preview.innerHTML;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.showStatusMessage('HTML copied to clipboard!', 'success');
    } catch (err) {
      this.showStatusMessage('Copy to clipboard not available', 'error');
    }
    
    document.body.removeChild(textArea);
  }

  showStatusMessage(message, type) {
    const prevText = this.status.textContent;
    const prevClass = this.status.className;
    
    this.status.textContent = message;
    this.status.className = `status status--${type}`;
    
    setTimeout(() => {
      this.status.textContent = prevText;
      this.status.className = prevClass;
    }, 3000);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.markdownEditor = new MarkdownEditor();
  
  // Handle PWA lifecycle events
  window.addEventListener('beforeunload', () => {
    // Could save draft here if needed
    console.log('[App] App is unloading');
  });
});