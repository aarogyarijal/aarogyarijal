# Aarogya Rijal's Portfolio

A modern, interactive portfolio website built with Next.js showcasing my professional experience, projects, technical skills, and education. The site features a clean, responsive design with interactive elements including a custom Wordle game.

## 🌟 Features

- **Interactive Profile Card** - Links to GitHub, LinkedIn, email, and resume
- **Work Experience & Projects** - Detailed showcase of professional roles and achievements
- **Technical Arsenal** - Comprehensive display of technical skills and expertise
- **Education Section** - Academic background and qualifications
- **Wordle Game** - Custom 4-letter word guessing game implementation
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark Mode Support** - Built-in light and dark theme support

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Components**: Custom React components with Lucide React icons
- **Fonts**: Geist Sans and Geist Mono
- **Interactive Elements**: React Globe GL, custom game components

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aarogyarijal/aarogyarijal.git
cd aarogyarijal
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the portfolio.

## 📁 Project Structure

```
├── app/
│   ├── components/       # React components
│   │   ├── ProfileCard.tsx
│   │   ├── WorkProjects.tsx
│   │   ├── Education.tsx
│   │   ├── TechnicalArsenal.tsx
│   │   └── WordleGame.tsx
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## 🔧 Development

- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`

## 📝 Customization

To customize this portfolio for your own use:

1. Update personal information in `app/components/ProfileCard.tsx`
2. Modify work experience in `app/components/WorkProjects.tsx`
3. Update education details in `app/components/Education.tsx`
4. Customize technical skills in `app/components/TechnicalArsenal.tsx`
5. Replace profile picture in `public/pfp.jpeg`
6. Update resume file in `public/` directory

## 🌐 Deployment

The easiest way to deploy this Next.js app is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Deploy with zero configuration

For other deployment options, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 📧 Contact

**Aarogya Rijal**
- Email: aarogya.rijal@gmail.com
- GitHub: [@aarogyarijal](https://github.com/aarogyarijal)
- LinkedIn: [aarogyarijal](https://linkedin.com/in/aarogyarijal)

## 📄 License

This project is open source and available for personal and educational use.
