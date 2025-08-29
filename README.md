# Sunx - Next.js Authentication Template

A modern, production-ready authentication template built with Next.js 15, Better Auth, Prisma ORM, and shadcn/ui components.
<div align="center">
  <img src="https://github.com/user-attachments/assets/1cde1a61-5b6d-4ef7-a912-a90f81b9dda2" alt="Sign In Page" width="300" height="200" style="border-radius: 8px; margin: 8px;" />
  <img src="https://github.com/user-attachments/assets/a5d9f67a-da94-483d-bae0-a585c67c9feb" alt="Sign Up Page" width="300" height="200" style="border-radius: 8px; margin: 8px;" />
  <img src="https://github.com/user-attachments/assets/731c5049-93e8-45ea-b256-bbd57319d41c" alt="Dashboard" width="300" height="200" style="border-radius: 8px; margin: 8px;" />
</div>
## ✨ Features

- 🔐 **Complete Authentication Flow** - Sign up, sign in, password reset
- 🎨 **Modern UI** - Beautiful dark theme with glassmorphism effects
- ⚡ **Next.js 15** - Latest App Router with server actions
- 🗄️ **Database Ready** - SQLite with Prisma (easy to swap to PostgreSQL)
- 🔒 **Better Auth** - Secure authentication with session management
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎯 **TypeScript** - Full type safety throughout
- 🎨 **shadcn/ui** - Professional UI components
- 🔄 **Server Actions** - Form handling with Zod validation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- bun, yarn, or pnpm

### 1. Clone and Install

```bash
git clone https://github.com/rajofearth/sunx.git
cd sunx
bun install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Update `.env` with your configuration:
```env
# Database (SQLite by default)
DATABASE_URL="file:./local.db"

# App URL (no trailing slash)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Generate by running openssl rand -base64 32 or bun x @better-auth/cli secret
BETTER_AUTH_SECRET="your-secret-here"
```

### 3. Database Setup

```bash
# Generate Prisma client
bun run prisma:generate

# Push schema to database
bun run db:push
```

### 4. Start Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── page.tsx              # Auth page (protected from logged-in users)
│   │   └── action.ts             # Server actions for auth
│   ├── dashboard/
│   │   └── page.tsx              # Protected dashboard
│   ├── forgot-password/
│   │   └── page.tsx              # Password reset request
│   ├── reset-password/
│   │   └── page.tsx              # Password reset form
│   ├── api/auth/[...all]/
│   │   └── route.ts              # Better Auth API routes
│   ├── globals.css               # Global styles & Tailwind
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (redirects to auth/dashboard)
├── components/
│   ├── auth-client.tsx           # Auth UI with tabs
│   ├── sign-in.tsx               # Sign in form
│   ├── sign-up.tsx               # Sign up form
│   ├── forgot-password-client.tsx # Forgot password UI
│   ├── reset-password-client.tsx # Reset password UI
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── auth.ts                   # Better Auth configuration
│   ├── auth-client.ts            # Client-side auth utilities
│   ├── action-helpers.ts         # Server action utilities
│   ├── types.ts                  # Zod schemas
│   ├── prisma.ts                 # Prisma client
│   └── utils.ts                  # Utility functions
└── generated/
    └── prisma/                   # Generated Prisma client
```

## 🛠️ Development Tools

This project uses modern development tools for optimal performance and code quality:

### Linting with oxlint

[oxlint](https://oxc.rs/docs/guide/usage/linter) is a fast JavaScript/TypeScript linter written in Rust. It provides:

- **Blazing fast performance** - Up to 50-100x faster than ESLint
- **Zero configuration** - Works out of the box with sensible defaults
- **TypeScript support** - Full TypeScript and React support
- **Next.js integration** - Optimized for Next.js projects

Configuration is in `oxlint.toml`:
```bash
bun run lint  # Run oxlint
```

### Formatting with Biome

[Biome](https://biomejs.dev/guides/getting-started/) is a fast formatter and linter written in Rust. It provides:

- **Fast formatting** - Format your code in milliseconds
- **Consistent style** - Enforce consistent code style across your project
- **Import organization** - Automatically organize and sort imports
- **Zero configuration** - Works with sensible defaults

Configuration is in `biome.json`:
```bash
bun run format  # Format code with Biome
```

## 🔧 Configuration

### Better Auth Setup

The authentication is configured in `src/lib/auth.ts`:

```typescript
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    async sendResetPassword({ user, url, token }, request) {
      // TODO: Implement your email sending logic here
      console.log(`Password reset email for ${user.email}: ${url}`);
    },
  },
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  plugins: [nextCookies()],
});
```

### Database Schema

The Prisma schema includes all necessary tables for Better Auth:

- **User** - User information and authentication data
- **Session** - User sessions for authentication
- **Account** - OAuth and credential accounts
- **Verification** - Email verification tokens

## 🎨 Customization

### Styling

The template uses Tailwind CSS v4 with a custom dark theme. Customize by modifying:

- `src/app/globals.css` - Global styles and CSS variables
- Component-specific classes in the components
- The theme uses CSS variables for easy customization

### Email Provider

To enable email functionality (password reset, verification), implement the email sending functions in `src/lib/auth.ts`:

```typescript
async sendResetPassword({ user, url, token }, request) {
  // Example with Resend
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'noreply@yourdomain.com',
      to: user.email,
      subject: 'Reset your password',
      html: `<a href="${url}">Reset Password</a>`,
    }),
  });
}
```

Popular email providers:
- [Resend](https://resend.com) - Developer-friendly email API
- [SendGrid](https://sendgrid.com) - Enterprise email service
- [Postmark](https://postmarkapp.com) - Transactional email
- [AWS SES](https://aws.amazon.com/ses/) - Amazon's email service

## 🚀 Deployment

### Environment Variables

Set these in your production environment:

```env
DATABASE_URL="your-production-database-url"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
BETTER_AUTH_SECRET="your-production-secret"
```

### Database Migration

For production, consider using PostgreSQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update the auth configuration:
```typescript
database: prismaAdapter(prisma, {
  provider: "postgresql",
}),
```

3. Deploy your database and run migrations:
```bash
npx prisma migrate deploy
```

### Deployment Platforms

This template works with all major deployment platforms:

- **Vercel** - Recommended for Next.js apps
- **Netlify** - Great for static sites
- **Railway** - Easy database + app deployment
- **Render** - Simple deployment with PostgreSQL
- **AWS/GCP/Azure** - Enterprise deployments

## 🛠️ Development

### Available Scripts

```bash
bun dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run oxlint for code linting
bun run format       # Format code with Biome
bun run typecheck    # TypeScript type checking
bun run prisma:generate  # Generate Prisma client
bun run db:push      # Push schema to database
```

### Adding New Features

1. **New Pages**: Add to `src/app/` following the existing pattern
2. **Components**: Create in `src/components/` with proper TypeScript
3. **Server Actions**: Use the `validatedAction` helper in `src/lib/action-helpers.ts`
4. **Database**: Add models to `prisma/schema.prisma`

## 🔒 Security Features

- **Password Hashing** - Uses scrypt for secure password hashing
- **Session Management** - Secure session handling with expiration
- **Input Validation** - Zod schemas for all form inputs
- **CSRF Protection** - Built-in CSRF protection with Better Auth
- **Rate Limiting** - Configurable rate limiting for auth endpoints
- **Type Safety** - Full TypeScript coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React framework
- [Better Auth](https://better-auth.com) - Authentication library
- [Prisma](https://prisma.io) - Database toolkit
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Tailwind CSS](https://tailwindcss.com) - CSS framework

---

**Ready to build something amazing?** 🚀

This template provides a solid foundation for any Next.js application requiring authentication. Just add your business logic and deploy!
