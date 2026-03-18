# Akal (Akaal) - Spiritual Artifacts Store

A modern, full-stack eCommerce platform dedicated to spiritual artifacts, built with a focus on performance, security, and a premium user experience.

## ✨ Project Overview

Akal is a high-end web application designed to showcase and sell spiritual items. It features a comprehensive customer-facing storefront and a powerful administrative dashboard for managing the store's operations.

## 🚀 Built With

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [Prisma ORM](https://www.prisma.io/) with PostgreSQL
- **Authentication**: [Auth.js (NextAuth.js)](https://authjs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Payments**: [Stripe](https://stripe.com/) (Integration in progress)
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)

## 🛠️ Key Features

### Storefront
- **Dynamic Product Catalog**: Browse products with advanced sorting and pagination.
- **Product Details**: Detailed views with descriptions, images, and pricing.
- **Wishlist & Cart**: Personalize the shopping experience by saving favorite items.
- **User Profiles**: Dashboard for customers to manage profiles and view order history.

### Admin Dashboard
- **Product Management**: Create, update, and manage the product inventory.
- **User Management**: Overview and management of registered users.
- **Orders & Tracking**: Manage customer orders and tracking status.
- **Settings & Notifications**: Customizable site settings and real-time admin notifications.

## 📁 Project Structure

```text
src/
├── app/            # Application routes and pages (Next.js App Router)
├── components/     # Reusable UI components (Admin, Cart, etc.)
├── api/            # API endpoints for data fetching and processing
├── lib/            # Utility functions and shared library code
├── prisma/         # Database schema and migrations
└── styles/         # Global styles and Tailwind configurations
```

## 🏁 Getting Started

### Prerequisites

- Node.js installed
- A running PostgreSQL database instance
- Environment variables configured in `.env` (Database URL, Auth secrets, etc.)

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd akal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.

## 🛣️ Roadmap

- [x] Initial design and layout
- [x] Admin Panel Implementation
- [x] Authentication & User Registration
- [x] Product Listing & Details
- [ ] Cart & Checkout Completion (Stripe integration)
- [ ] Advanced Search & Filtering
- [ ] Multi-language Support (Localization)

## 📄 License

This project is privately owned. All rights reserved.
