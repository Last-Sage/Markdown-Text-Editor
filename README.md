# 📝 Markdown Editor

A modern, fast, and beautiful Markdown editor built with [Astro](https://astro.build) featuring real-time preview, dark mode, and zero dependencies for the core functionality.

<!-- ![Markdown Editor Screenshot](https://via.placeholder.com/800x400?text=Markdown+Editor+Screenshot) -->

## ✨ Features

- **🚀 Real-time Preview** - See your Markdown rendered as you type
- **🌓 Dark/Light Mode** - Toggle between themes with automatic system detection
- **📊 Word & Character Count** - Track your document statistics in real-time
- **🎨 Rich Toolbar** - Quick formatting buttons for common Markdown syntax
- **💾 Session Auto-save** - Never lose your work during a session
- **📥 Export Options** - Download as `.md` or `.html` files
- **📋 Copy HTML** - One-click copy rendered HTML to clipboard
- **📱 Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- **⚡ Lightning Fast** - Built with Astro for optimal performance
- **🎯 Zero Config** - Works out of the box, no setup required

## 🚀 Quick Start

### Prerequisites

- Node.js 18.14.1 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/markdown-editor.git
cd markdown-editor
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:4321`

## 📦 Build & Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

### Deploy

This is a static site that can be deployed to any static hosting service:

- **Netlify**: Drop the `dist` folder into Netlify
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Use GitHub Actions or push to `gh-pages` branch
- **Cloudflare Pages**: Connect your Git repository

## 🛠️ Tech Stack

- **[Astro](https://astro.build)** - Static Site Generator
- **[Marked.js](https://marked.js.org)** - Markdown parser
- **Vanilla JavaScript** - No framework dependencies
- **Custom CSS** - Beautiful design system included

## 📂 Project Structure

```
markdown-editor/
├── src/
│   ├── components/
│   │   ├── Actions.astro    # Export and action buttons
│   │   ├── Editor.astro     # Editor textarea component
│   │   ├── Preview.astro    # Live preview pane
│   │   └── Toolbar.astro    # Formatting toolbar
│   ├── layouts/
│   │   └── Layout.astro     # Main HTML layout
│   ├── pages/
│   │   └── index.astro      # Homepage
│   ├── scripts/
│   │   └── editor.js        # Editor logic and functionality
│   └── styles/
│       └── global.css       # Global styles and design system
├── public/                  # Static assets
├── astro.config.mjs        # Astro configuration
├── package.json
└── README.md
```

## 🎮 Usage

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + B` | Bold |
| `Ctrl/Cmd + I` | Italic |
| `Ctrl/Cmd + K` | Insert Link |
| `Tab` | Indent |
| `Shift + Tab` | Outdent |

### Toolbar Buttons

- **B** - Bold text
- **I** - Italic text
- **H1, H2, H3** - Heading levels
- **🔗** - Insert link
- **<>** - Code block
- **•** - Unordered list
- **1.** - Ordered list

### Markdown Support

The editor supports all standard Markdown syntax including:

- Headers (H1-H6)
- Bold and italic text
- Links and images
- Code blocks with syntax highlighting
- Lists (ordered and unordered)
- Blockquotes
- Tables
- Horizontal rules
- Line breaks

## 🎨 Customization

### Modifying Styles

The design system is defined in `src/styles/global.css`. Key customization points:

```css
:root {
  /* Colors */
  --color-primary: var(--color-teal-500);
  --color-background: var(--color-cream-50);
  
  /* Typography */
  --font-family-base: "FKGroteskNeue", "Inter", sans-serif;
  --font-family-mono: "Berkeley Mono", monospace;
  
  /* Spacing */
  --space-16: 16px;
  --radius-base: 8px;
}
```

### Adding Toolbar Buttons

Edit the `toolbarButtons` array in `src/scripts/editor.js`:

```javascript
this.toolbarButtons = [
  { name: 'Bold', syntax: '**', icon: 'B', wrap: true },
  // Add your custom button here
];
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design system inspired by modern web applications
- Built with love using [Astro](https://astro.build)
- Markdown parsing by [Marked.js](https://marked.js.org)

## 📞 Support

If you have any questions or need help, please:

- Open an [issue](https://github.com/Last-sage/markdown-editor/issues)
- Contact via email: lastsage@consolecats.com

---

<p align="center">Made with ❤️ by LastSage/p>