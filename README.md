# 📝 Markdown Editor PWA

A modern, fast, and beautiful Markdown editor built with [Astro](https://astro.build) featuring real-time preview, dark mode, **offline support**, and **Progressive Web App (PWA)** capabilities.

<!-- ![Markdown Editor Screenshot](https://via.placeholder.com/800x400?text=Markdown+Editor+Screenshot) -->

## ✨ Features

### Core Features
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

### 📱 PWA Features
- **📲 Installable App** - Install as a native app on any device
- **🌐 Offline Support** - Works completely offline after first visit
- **🔄 Auto-Updates** - Automatic updates with user notifications
- **📶 Network Status** - Real-time online/offline indicator
- **🎯 App Shortcuts** - Quick actions from home screen/start menu
- **⌨️ Keyboard Shortcuts** - Enhanced keyboard navigation
- **🎨 Native Experience** - Custom splash screen and app theming
- **🔔 Push Notifications** - Update notifications (future feature)

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

### 📱 PWA Setup

To enable full PWA functionality:

1. **Generate PWA Icons**:
   - Open `icon-generator.html` in your browser
   - Customize your app icon (text, colors, style)
   - Download all icon sizes
   - Place icons in the `icons/` folder

2. **Deploy with HTTPS** (required for PWA features):
   - Use any static hosting service with HTTPS
   - PWA features only work over HTTPS (except localhost)

3. **Test PWA Features**:
   - Install prompt should appear in supported browsers
   - Test offline functionality
   - Verify app shortcuts work

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

### Deploy with PWA Support

This PWA can be deployed to any static hosting service with HTTPS:

- **Netlify**: 
  - Drop the `dist` folder into Netlify
  - HTTPS enabled by default
  - PWA features work immediately

- **Vercel**: 
  - Connect your Git repository
  - HTTPS enabled by default
  - Excellent PWA support

- **GitHub Pages**: 
  - Use GitHub Actions or push to `gh-pages` branch
  - Enable HTTPS in repository settings
  - May need custom domain for full PWA features

- **Cloudflare Pages**: 
  - Connect your Git repository
  - Excellent PWA and service worker support
  - Built-in CDN for faster loading

### PWA Deployment Checklist

- ✅ Deploy over HTTPS
- ✅ Include all PWA files (`manifest.json`, `service-worker.js`, etc.)
- ✅ Upload all icon sizes to `icons/` folder
- ✅ Test install prompt on mobile devices
- ✅ Verify offline functionality
- ✅ Test app shortcuts

## 🛠️ Tech Stack

- **[Astro](https://astro.build)** - Static Site Generator
- **[Marked.js](https://marked.js.org)** - Markdown parser
- **Service Workers** - Offline functionality and caching
- **Web App Manifest** - PWA installation and theming
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
│   │   ├── editor.js        # Editor logic and functionality
│   │   └── pwa-manager.js   # PWA installation and updates
│   └── styles/
│       └── global.css       # Global styles and design system
├── public/                  # Static assets
│   ├── manifest.json        # PWA manifest
│   ├── service-worker.js    # Service worker for offline support
│   └── icons/              # PWA icons (all sizes)
│       ├── icon-72x72.png
│       ├── icon-96x96.png
│       ├── icon-128x128.png
│       ├── icon-144x144.png
│       ├── icon-152x152.png
│       ├── icon-192x192.png
│       ├── icon-384x384.png
│       └── icon-512x512.png
├── icon-generator.html      # Tool to generate PWA icons
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
| `Ctrl/Cmd + S` | Download Markdown |
| `Ctrl/Cmd + N` | New Document |
| `Ctrl/Cmd + E` | Export HTML |
| `Ctrl/Cmd + Shift + C` | Copy HTML |
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

### 📱 PWA Usage

#### Installing the App
1. **Desktop**: Click the install button in the address bar or use the in-app install button
2. **Mobile**: Use "Add to Home Screen" from browser menu or tap the install prompt
3. **Chrome**: Look for the install icon in the address bar

#### Offline Usage
- The app works completely offline after the first visit
- All documents are saved in session memory
- Export functionality works offline
- Updates download automatically when back online

#### App Shortcuts
- **Right-click app icon** (desktop) for quick actions
- **Long-press app icon** (mobile) for context menu
- Available shortcuts:
  - New Document
  - Export HTML

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

### Modifying PWA Settings

Edit `manifest.json` to customize:

```json
{
  "name": "Your App Name",
  "short_name": "Short Name",
  "description": "Your app description",
  "theme_color": "#32808d",
  "background_color": "#1f2121"
}
```

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

### Customizing Service Worker

Modify caching behavior in `service-worker.js`:

```javascript
// Add files to cache
const STATIC_FILES = [
  '/',
  '/index.html',
  '/style.css',
  // Add your files here
];
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design system inspired by modern web applications
- Built with love using [Astro](https://astro.build)
- Markdown parsing by [Marked.js](https://marked.js.org)
- PWA capabilities following web standards
- Icon generation tools included

## 📞 Support

If you have any questions or need help, please:

- Open an [issue](https://github.com/Last-Sage/Markdown-Text-Editor/issues)
- Check the PWA troubleshooting section above
- Contact via email: lastsage@consolecats.com

## 🚀 What's Next?

### Planned PWA Features
- **📊 Usage Analytics** - Track app usage patterns
- **🔔 Push Notifications** - Update notifications and reminders
- **☁️ Cloud Sync** - Optional cloud document synchronization
- **📱 Native Integrations** - Share target API support
- **🎨 Theme Customization** - User-customizable themes
- **📝 Document Templates** - Pre-built markdown templates

---

<p align="center">Made with ❤️ and PWA magic by the community</p>

<p align="center">
  <strong>📱 Install this app on your device for the best experience!</strong>
</p>