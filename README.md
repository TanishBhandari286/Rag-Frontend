# 🤖 RAG Bot - AI-Powered Chatbot

A beautiful, production-ready RAG (Retrieval-Augmented Generation) chatbot built with Next.js 14, integrated with n8n for intelligent responses based on your university's Python study materials.

## ✨ Features

- 🎨 **Stunning UI** - Animated glowing purple sphere with floating particles
- 🔄 **Real-time Chat** - Instant responses powered by n8n RAG workflow
- 📊 **Markdown Support** - Beautiful rendering of tables, code blocks, and formatted text
- 💾 **Session History** - Chat history persists during your session
- 🔐 **Secure** - Basic authentication for n8n webhook
- 📱 **Responsive** - Works seamlessly on desktop and mobile
- 🐳 **Docker Ready** - Optimized production Docker image

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Rag-Bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t rag-bot .
   ```

2. **Run the container**
   ```bash
   docker run -d -p 3000:3000 --name rag-bot-container rag-bot
   ```

3. **Access the application**
   
   Open [http://localhost:3000](http://localhost:3000)

4. **Stop the container**
   ```bash
   docker stop rag-bot-container
   ```

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Markdown**: react-markdown, remark-gfm
- **Backend**: n8n RAG workflow with OpenAI embeddings
- **Deployment**: Docker, Alpine Linux

## 🔧 Configuration

### n8n Webhook

The app connects to an n8n webhook for AI responses. Update the webhook URL in `app/page.tsx`:

```typescript
const response = await fetch(
  "https://n8n.macandcode.cloud/webhook/bf4dd093-bb02-472c-9454-7ab9af97bd1d",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa("username:password"),
    },
    body: JSON.stringify({ query: userQuery }),
  }
);
```

### Authentication

Update the credentials in the Authorization header:
```typescript
Authorization: "Basic " + btoa("your-username:your-password")
```

## 📁 Project Structure

```
Rag-Bot/
├── app/
│   ├── page.tsx           # Main chat interface
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── GlowingSphere.tsx  # Animated sphere component
│   └── ParticleField.tsx  # Background particles
├── Dockerfile             # Production Docker image
├── .dockerignore          # Docker build exclusions
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS config
└── package.json           # Dependencies
```

## 🎨 Features Breakdown

### Chat Interface
- Real-time message display with smooth animations
- User messages on the right (purple gradient)
- AI responses on the left (dark background)
- Loading states with visual feedback

### Markdown Rendering
- Tables with purple-themed styling
- Code blocks with syntax highlighting
- Headers, lists, and formatted text
- GitHub Flavored Markdown support

### Session Management
- Automatic chat history saving to sessionStorage
- Persists across page refreshes
- Clears when browser tab is closed

### Visual Design
- Glowing purple sphere with 80 floating particles
- Pulsing animations (3-4 second cycles)
- Rotating ring effect
- Smooth transitions with Framer Motion

## 🔄 How It Works

1. **User Input** → User types a question and presses Enter
2. **API Request** → POST request sent to n8n webhook with query
3. **RAG Processing** → n8n retrieves relevant context from vector database
4. **AI Generation** → OpenAI generates response based on context
5. **Response Display** → Markdown-formatted response rendered in chat

## 📊 n8n Workflow Structure

Your n8n workflow should:
1. Receive webhook POST with `{ query: "user question" }`
2. Query vector database (FAISS/Chroma/Pinecone)
3. Send context + query to OpenAI
4. Return response in format: `{ output: "AI response with markdown" }`

## 🐳 Docker Details

The Dockerfile uses multi-stage builds:
- **Stage 1**: Install dependencies
- **Stage 2**: Build Next.js application
- **Stage 3**: Create minimal runtime image (~300MB)

Features:
- Non-root user for security
- Alpine Linux base for small size
- Optimized layer caching

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Build Docker image
docker build -t rag-bot .

# Run Docker container
docker run -p 3000:3000 rag-bot
```

## 🚀 Deployment

### Vercel
```bash
vercel deploy
```

### Docker (Any Platform)
```bash
docker build -t rag-bot .
docker run -d -p 3000:3000 rag-bot
```

### Manual Build
```bash
npm run build
npm start
```

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📧 Support

For questions or issues, please open a GitHub issue or contact the maintainer.

---

Built with ❤️ using Next.js, n8n, and OpenAI
