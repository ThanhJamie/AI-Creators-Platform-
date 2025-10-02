# Creatr - AI-Powered Content Creation Platform

<div align="center">
  <img src="/public/logo.png" alt="Creatr Logo" width="120" height="40" />
  
  <p align="center">
    A modern, full-stack content creation platform with AI-powered features
  </p>
</div>

## 🚀 Project Overview

Creatr is a comprehensive content creation platform that enables users to create, publish, and manage their content with AI assistance. Built with modern web technologies, it features a sleek dashboard, real-time analytics, social features, and advanced image management capabilities.

## ✨ Key Features

### 🎯 Content Management

- **Rich Text Editor**: Advanced post creation with React Quill editor
- **Draft System**: Auto-save drafts and resume editing anytime
- **Featured Images**: Upload and transform images with ImageKit integration
- **Content Scheduling**: Schedule posts for future publication
- **Categories & Tags**: Organize content with flexible tagging system
- **Post Status Management**: Draft, published, and scheduled content states

### 👤 User Experience

- **Authentication**: Secure user authentication with Clerk
- **Public Profiles**: Customizable user profiles with unique usernames
- **Social Features**: Follow/unfollow system and user interactions
- **Real-time Feed**: Dynamic content feed with trending algorithms
- **Mobile Responsive**: Optimized for all device sizes

### 📊 Analytics & Dashboard

- **Comprehensive Dashboard**: Overview of content performance
- **Analytics Charts**: Visual data representation with Chart.js
- **View Tracking**: Monitor post engagement and reach
- **Content Statistics**: Track likes, comments, and follower growth
- **Performance Metrics**: Detailed insights into content performance

### 🤖 AI Integration

- **Google Gemini AI**: AI-powered content suggestions and assistance
- **Smart Content Enhancement**: AI-driven content optimization
- **Automated Tagging**: Intelligent tag suggestions

### 🖼️ Advanced Image Management

- **ImageKit Integration**: Professional image upload and transformation
- **Image Optimization**: Automatic image compression and formatting
- **Custom Transformations**: Resize, crop, and enhance images
- **CDN Delivery**: Fast global image delivery

### 💬 Engagement Features

- **Comments System**: Interactive comment threads on posts
- **Like System**: Engagement tracking and user interactions
- **Social Sharing**: Easy content sharing capabilities

## 🛠️ Tech Stack

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4-alpha)** - Latest Tailwind with Oxide engine
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Next Themes](https://github.com/pacocoursey/next-themes)** - Theme management

### Backend & Database

- **[Convex](https://convex.dev/)** - Real-time backend with type-safe APIs
- **Real-time subscriptions** - Live data synchronization
- **Serverless functions** - Scalable backend operations

### Authentication & User Management

- **[Clerk](https://clerk.com/)** - Complete authentication solution
- **Social logins** - Multiple authentication providers
- **User management** - Profile and session handling

### Media & Assets

- **[ImageKit](https://imagekit.io/)** - Image optimization and transformation
- **CDN delivery** - Global image distribution
- **Real-time transformations** - On-the-fly image processing

### AI & Content Enhancement

- **[Google Gemini AI](https://deepmind.google/technologies/gemini/)** - Advanced AI integration
- **Content assistance** - AI-powered writing help
- **Smart suggestions** - Intelligent content optimization

### Development Tools

- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and better DX
- **[ESLint](https://eslint.org/)** - Code linting and quality
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms
- **[Zod](https://zod.dev/)** - Schema validation
- **[Date-fns](https://date-fns.org/)** - Date manipulation
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### UI Components & Libraries

- **[React Quill](https://github.com/zenoamaro/react-quill)** - Rich text editor
- **[React Dropzone](https://react-dropzone.js.org/)** - File upload handling
- **[Chart.js](https://www.chartjs.org/) & React-Chartjs-2** - Data visualization
- **[React Spinners](https://mhnpd.github.io/react-loader-spinner/)** - Loading indicators
- **[React Intersection Observer](https://github.com/thebuilder/react-intersection-observer)** - Scroll-based interactions
- **[Class Variance Authority](https://cva.style/docs)** - Component variant management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ThanhJamie/AI-Creators-Platform-.git
cd creatr
```

2. **Install dependencies**

```bash
# Using bun (recommended)
bun install

# Or using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

3. **Set up environment variables**
   Create a `.env.local` file and add your configuration:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Convex Backend
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
CONVEX_DEPLOY_KEY=your_convex_deploy_key

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Google Gemini AI
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

4. **Run the development server**

```bash
# Using bun
bun dev

# Or using npm
npm run dev

# Or using yarn
yarn dev

# Or using pnpm
pnpm dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
creatr/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (public)/          # Public pages (profiles, feed)
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard pages
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   └── ...               # Feature-specific components
├── convex/               # Convex backend functions
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and config
├── public/               # Static assets
└── ...                   # Configuration files
```

## 🎨 Key Pages & Features

- **Landing Page** (`/`) - Marketing and authentication
- **Feed** (`/feed`) - Main content discovery
- **Dashboard** (`/dashboard`) - Content management hub
- **Create Post** (`/dashboard/create`) - Rich post editor
- **User Profiles** (`/[username]`) - Public user pages
- **Post Details** (`/[username]/[postId]`) - Individual post pages
- **Settings** (`/dashboard/settings`) - User preferences

## 🔧 Development

### Scripts

- `bun dev` - Start development server with Turbopack
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Component-based architecture
- Custom hooks for logic reuse

## 📈 Performance Features

- **Next.js App Router** - Optimized routing and rendering
- **Turbopack** - Fast development builds
- **Image Optimization** - Automatic image optimization
- **Real-time Updates** - Live data synchronization
- **Mobile Optimization** - Responsive design patterns

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Convex](https://convex.dev/) for the powerful backend platform
- [Clerk](https://clerk.com/) for authentication services
- [ImageKit](https://imagekit.io/) for image management
- [Google](https://deepmind.google/technologies/gemini/) for Gemini AI integration
