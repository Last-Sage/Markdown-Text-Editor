// Markdown Editor Application (No localStorage per strict instructions)
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
      this.defaultContent = `# Welcome to Markdown Editor\n\nThis is a **modern** and *fast* markdown editor built with Astro and Preact.\n\n## Features\n\n- Real-time preview\n- Dark/Light mode\n- Auto-save (session)\n- Offline support\n- Word/character count\n\n### Code Example\n\n\`\`\`javascript\nconst hello = 'world';\nconsole.log(hello);\n\`\`\`\n\n### Links\n\n[Astro Documentation](https://docs.astro.build)\n\n### Lists\n\n- Item 1\n- Item 2\n- Item 3\n\n1. First\n2. Second\n3. Third\n\n> This is a blockquote example\n\nStart editing to see the magic happen!`;
  
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
          const html = marked.parse(this.content, { breaks: true, gfm: true });
          this.preview.innerHTML = html;
        } catch (error) {
          console.error('Markdown parsing error:', error);
          this.preview.innerHTML = '<p>Error parsing markdown</p>';
        }
      } else {
        // Fallback if marked.js fails to load
        this.preview.textContent = this.content;
      }
    }
  
    updateCounts() {
      const text = this.content.trim();
      const words = text ? text.split(/\s+/).length : 0;
      const chars = this.content.length;
      this.wordCount.textContent = words;
      this.charCount.textContent = chars;
    }
  
    saveContent() {
      // Session-only save (no persistent storage)
      this.status.textContent = 'Saved';
      this.status.className = 'status status--saved';
    }
  
    insertMarkdown(button) {
      const start = this.editor.selectionStart;
      const end = this.editor.selectionEnd;
      const selectedText = this.content.substring(start, end);
      let insertion = '';
      let finalCursor = null;
  
      if (button.wrap) {
        insertion = `${button.syntax}${selectedText || 'text'}${button.syntax}`;
        finalCursor = start + button.syntax.length;
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
      } else if (button.block) {
        insertion = selectedText
          ? `\`\`\`\n${selectedText}\n\`\`\``
          : button.syntax;
        finalCursor = insertion.indexOf('\n') + 1;
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
    }
  
    newDocument() {
      if (this.content.trim() && !confirm('Create a new document? Current content will be cleared.')) {
        return;
      }
      this.content = '';
      this.editor.value = '';
      this.afterInsert();
    }
  
    downloadMarkdown() {
      const blob = new Blob([this.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.md';
      a.click();
      URL.revokeObjectURL(url);
    }
  
    downloadHtml() {
      const skeleton = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Markdown Document</title>\n<style>body{font-family:sans-serif;line-height:1.6;padding:2rem 1rem;max-width:800px;margin:auto;}pre{background:#f4f4f4;padding:1rem;border-radius:5px;overflow-x:auto;}code{background:#f4f4f4;padding:0.2em 0.4em;border-radius:3px;}blockquote{border-left:4px solid #ddd;padding-left:1rem;color:#666;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ddd;padding:0.5rem;text-align:left;}th{background:#f9f9f9;}</style>\n</head>\n<body>`;
      const htmlContent = `${skeleton}\n${this.preview.innerHTML}\n</body>\n</html>`;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  
    async copyHtml() {
      try {
        await navigator.clipboard.writeText(this.preview.innerHTML);
        const prevText = this.status.textContent;
        const prevClass = this.status.className;
        this.status.textContent = 'HTML Copied!';
        this.status.className = 'status status--success';
        setTimeout(() => {
          this.status.textContent = prevText;
          this.status.className = prevClass;
        }, 2000);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
        alert('Copy to clipboard not available');
      }
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    new MarkdownEditor();
  });