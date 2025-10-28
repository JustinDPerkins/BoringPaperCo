# The Boring Paper Company - TypeScript Edition

A modern TypeScript React application for a paper manufacturing company with custom watermark functionality and shopping cart features.

## Features

- 🛍️ **Product Catalog** - Browse and add paper products to cart
- 💧 **Custom Watermarks** - Upload images or text to create custom watermarks
- 🛒 **Shopping Cart** - Manage items with quantity controls
- 🤖 **AI Chat Assistant** - Interactive chatbot with security controls
- 📤 **File Upload** - Secure file scanning with backend API integration
- 🎨 **Vintage Theme** - Dark, elegant design with creamy accents
- ⚡ **TypeScript** - Fully typed for better development experience
- 🚀 **Vite** - Fast development and optimized builds

## Tech Stack

- **React 18** with TypeScript
- **Material-UI** (MUI) v7 for components
- **React Router** for navigation
- **Vite** for build tooling
- **Context API** for state management
- **Backend APIs** - SDK, Chat, XDR services

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Runs on http://localhost:3000

### Build

\`\`\`bash
npm run build
\`\`\`

### Preview

\`\`\`bash
npm run preview
\`\`\`

## Project Structure

\`\`\`
bpc/
├── src/
│   ├── assets/          # Static assets (images, logos)
│   ├── components/       # Reusable components
│   ├── context/          # React Context providers
│   ├── pages/           # Page components
│   ├── theme/           # MUI theme configuration
│   ├── types/           # TypeScript interfaces
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── public/              # Public assets
└── package.json         # Dependencies
\`\`\`

## Features Overview

### Product Catalog
- View available paper products
- Add items to shopping cart
- Category filtering
- Stock status indicators

### Custom Watermarks
- Upload image files (PNG, JPEG, GIF, WebP)
- Create text-based watermarks
- Adjust opacity and scale
- Position control (X/Y coordinates)
- Live preview
- Edit and delete watermarks
- Optional backend file scanning via API

### Shopping Cart
- Add/remove items
- Quantity controls
- Price calculation
- Order summary
- Cart persistence during session

### AI Chat Assistant
- Interactive chatbot with AI responses
- Security protection toggle
- Real-time message handling
- Error handling and recovery

### Backend API Integration
The app connects to backend services:
- `/api/chat/` - AI chat service (port 5001)
- `/api/sdk/` - File upload and scanning (port 5000)
- `/api/xdr/` - Container XDR service (port 8081, WebSocket)
- `/api/ollama/` - LLM service (port 11434)

## Development Notes

This is a demo/educational project showcasing:
- TypeScript best practices
- React Context API
- Material-UI theming
- File upload handling
- State management

Not intended for production use without additional security hardening.
