# Recipe Recommendations Frontend

This is the frontend application for [recipe-recommendations.com](https://recipe-recommendations.com), a platform that helps users discover and explore new recipes. The application is built with Next.js and provides a modern, responsive user interface for browsing and searching recipes.

## Layout and Features

### Search Interface
- A prominent search bar at the top of the page allows users to search for recipes
- The search interface includes a logo and title for brand recognition
- Empty search states are handled with a helpful message

### Results Display
The recipe results are presented in a responsive grid layout that adapts to different screen sizes:

- **Wide Screens (≥1200px)**: 
  - 3 columns of recipe cards
  - Optimal for desktop viewing
  - Maximum information density

- **Medium Screens (768px-1199px)**:
  - 2 columns of recipe cards
  - Balanced layout for tablets and smaller desktops
  - Maintains readability while showing more content

- **Mobile Screens (<768px)**:
  - Single column layout
  - Optimized for mobile viewing
  - Easy scrolling and reading on smaller screens

### Recipe Cards
Each recipe is displayed in a card format that includes:
- Recipe title
- Recipe image (when available)
- Consistent card height for a clean layout
- Hover effects for better interactivity
- Click handling for recipe details

### Infinite Scroll
- Results load automatically as the user scrolls
- Loading states are indicated with a message
- Smooth pagination without page reloads
- Efficient memory usage with progressive loading

## Technical Details

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
