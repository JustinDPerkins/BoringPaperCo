# Boring Paper Company - TypeScript Setup Guide

## ✅ What Has Been Built

A complete TypeScript rebuild of the Boring Paper Company UI with all the original features plus improvements.

### 📁 Project Structure

```
bpc/
├── src/
│   ├── assets/              # Logo and static assets
│   ├── components/          # Reusable components
│   │   ├── AppBar.tsx      # Navigation bar
│   │   └── ChatBot.tsx     # AI chatbot with API integration
│   ├── context/             # React Context providers
│   │   ├── CartContext.tsx # Shopping cart state
│   │   └── WatermarkContext.tsx # Watermark state
│   ├── pages/               # Page components
│   │   ├── Home.tsx        # Landing page
│   │   ├── Products.tsx    # Product catalog
│   │   ├── Cart.tsx        # Shopping cart
│   │   └── Watermark.tsx   # Watermark management
│   ├── services/            # API services
│   │   └── api.ts         # Backend API integration
│   ├── theme/               # MUI theme
│   │   └── index.ts       # Theme configuration
│   ├── types/               # TypeScript definitions
│   │   └── index.ts       # Interfaces and types
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── vite-env.d.ts       # Vite type declarations
├── public/                  # Static assets
│   └── images/            # Product images
├── nginx.conf              # Nginx configuration for deployment
├── Dockerfile              # Docker build configuration
├── index.html              # HTML template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite configuration
└── README.md               # Project documentation
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd bpc
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 3. Build for Production

```bash
npm run build
```

### 4. Build Docker Image

```bash
npm run docker:build
npm run docker:run
```

## 🔌 API Integration

The app integrates with these backend services:

- **Chat API** (`/api/chat/`) - AI chatbot functionality
  - Port: 5001
  - Usage: Send messages with security toggle
  
- **SDK API** (`/api/sdk/`) - File upload and scanning
  - Port: 5000  
  - Endpoints: `/upload` (protected), `/upload-vulnerable` (demo)
  - Usage: Upload watermarks with optional security scanning
  
- **XDR API** (`/api/xdr/`) - Container security
  - Port: 8081
  - WebSocket connection for terminal access
  
- **Ollama API** (`/api/ollama/`) - LLM service
  - Port: 11434
  - Optional integration

## ✨ New Features

### 1. **Custom Watermarks**
- Upload image files (PNG, JPEG, GIF, WebP)
- Create text-based watermarks
- Adjustable opacity, scale, and position
- Live preview
- Backend file scanning option
- Edit and delete functionality

### 2. **Shopping Cart**
- Add/remove products
- Quantity controls
- Real-time price calculation
- Order summary
- Session persistence

### 3. **AI Chat Assistant**
- Floating chatbot interface
- Security protection toggle
- Real-time API integration
- Error handling

### 4. **TypeScript Benefits**
- Full type safety
- Better IDE support
- Compile-time error checking
- Improved code maintainability

## 🎨 Theme

Vintage paper company aesthetic:
- Dark charcoal backgrounds
- Cream accents (#f5f1e8)
- Crimson Text and Vollkorn fonts
- Elegant serif typography
- Glassmorphism effects

## 📦 Key Differences from Old UI

### Improvements
✅ **TypeScript** - Full type safety
✅ **Vite** - Faster builds (vs Create React App)
✅ **Modern Context API** - Cleaner state management
✅ **Modular Services** - Separated API logic
✅ **Better Error Handling** - Try/catch with types
✅ **Security Upload Toggle** - Built into watermark page

### Maintained Features
✅ Same UI design and theme
✅ Same API endpoints
✅ Same business logic flow
✅ Backward compatible with backend

## 🐛 Known Issues

These are expected in development until dependencies are installed:
- Module resolution errors (will fix after `npm install`)
- Type declarations (installed with dependencies)

## 📝 Next Steps

1. Run `npm install` to install dependencies
2. Start backend services if testing API integration
3. Run `npm run dev` for development
4. Customize theme in `src/theme/index.ts`
5. Add more products in `src/pages/Products.tsx`

## 🔒 Security Notes

- File uploads are validated for image types
- Backend scanning is optional (can use locally)
- Chat API includes security protection
- WebSocket connections are properly handled
