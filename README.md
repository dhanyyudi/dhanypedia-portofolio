# 🌍 Dhanypedia - GIS Portfolio

A modern, high-performance GIS Portfolio website built with **Next.js 16**, **Tailwind CSS**, and **Supabase**. Featuring an interactive 3D Globe, dynamic project mapping, and a secure admin dashboard.

![Portfolio Preview](public/preview.png)

## ✨ Features

- **Interactive 3D Globe**: Visualizing project locations on a WebGL-powered globe (using `globe.gl` & `three.js`).
- **Dynamic Maps**: Detailed map views using `Leaflet` & `React-Leaflet`.
- **Admin Dashboard**: Secure content management system to add, edit, or delete projects.
- **Supabase Backend**: Fully integrated with Supabase for Database, Authentication, and Media Storage.
- **Responsive Design**: Optimized for Desktop and Mobile with a futuristic, dark-themed UI.
- **Modern Animations**: Smooth transitions powered by `framer-motion`.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database & Auth**: [Supabase](https://supabase.com/)
- **3D Visualization**: globe.gl / Three.js
- **Maps**: React Leaflet
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase account and project

### 1. Clone the Repository

```bash
git clone https://github.com/dhanyyudi/dhanypedia-portofolio.git
cd dhanypedia-portofolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add your credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin Authentication
# Generate a hash for your password (e.g. using bcryptjs)
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your-bcrypt-hash
JWT_SECRET=your-secure-jwt-secret
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📂 Project Structure

```bash
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
├── lib/              # Utility functions and Supabase client
├── types/            # TypeScript interfaces
└── ...
```

## 📦 Deployment

This project is optimized for deployment on **Vercel**.

1. Import the repository to Vercel.
2. Add the Environment Variables in project settings.
3. Deploy!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Dhanypedia**
- Website: [dhanypedia.com](https://dhanypedia.com)
- GitHub: [@dhanyyudi](https://github.com/dhanyyudi)
