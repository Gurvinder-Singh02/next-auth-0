# Next.js + Auth0 Integration
This project is the simplest way to  integrate **Auth0** with **Next.js** for user authentication and route protection. 

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Auth0 Configuration](#auth0-configuration)
- [Routes](#routes)
- [Protecting Routes](#protecting-routes)
- [Fetching User Data](#fetching-user-data)
  - [Client-side](#client-side)
  - [Server-side](#server-side)
  
## Getting Started

### 1. Create a new application in Auth0

To begin, create a new **Web Application** in your **Auth0** dashboard.

### 2. Configure Callbacks

In your Auth0 app settings, configure the **Allowed Callback URLs** as per the **Next.js Auth0** Quickstart guide.

## Installation

Install the required Auth0 package:

```bash
npm install @auth0/nextjs-auth0
```

## Environment Variables

In the root of your project, create a `.env.local` file and add the following variables:

```bash
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-auth0-domain.us.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'
```

Replace the placeholders with your actual Auth0 application values.

## Auth0 Configuration

1. **Configure Authentication Routes**  
   Add the following code to `app/api/auth/[auth0]/route.js` to handle authentication requests:

   ```js
   import { handleAuth } from '@auth0/nextjs-auth0';

   export const GET = handleAuth();
   ```

2. **Available Routes**  
   After setting up, the following routes are available for authentication:

   - `/api/auth/login`: Initiates the Auth0 login process.
   - `/api/auth/logout`: Logs the user out.
   - `/api/auth/callback`: The callback route where Auth0 redirects after login.
   - `/api/auth/me`: Fetches the authenticated user profile.
  
## Add the provider in layout to access the session data all over the app
```js

import { UserProvider } from '@auth0/nextjs-auth0/client'

export default function RootLayout({children,}: Readonly<{children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./favicon.png" sizes="any" />
      </head>
      <body >
        <UserProvider>

            {children}

        </UserProvider>
      </body>
    </html>
  )
}
```


## Fetching User Data

You can fetch user data either on the **client side** or the **server side**.

### Client-side

For client-side user data fetching, use the `useUser` hook:

```tsx
"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

const ProfileClient = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return user ? (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  ) : (
    <div>No user logged in</div>
  );
};

export default ProfileClient;
```

### Server-side

For server-side data fetching, you can use `getSession`:

```tsx
import { getSession } from "@auth0/nextjs-auth0";

const ProfileServer = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return null;
  }

  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

export default ProfileServer;
```

## Protecting Routes

There are multiple ways to protect routes in a Next.js + Auth0 setup:

### 1. Using Middleware (Recommended for Edge Functions)

You can protect multiple routes using `middleware.ts`:

```ts
import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";

export default withMiddlewareAuthRequired();

export const config = {
  matcher: ['/home', '/dashboard', '/wallofshame', '/user']
};
```

This approach applies authentication checks across specific routes (defined using `matcher`).

For more details on excluding specific routes, refer to this [Dev.to article](https://dev.to/sabbirsobhani/efficient-route-protection-in-nextjs-with-auth0-middleware-excluding-specific-routes-1d3f).

### 2. Protecting Individual Pages

For individual pages, you can use the following methods:

#### Method 1: Manual Session Check (Server Component)

In your server components, check if a user is authenticated using `getSession()`:

```tsx
const session = await getSession();
const user = session?.user;

if (!user) {
  redirect("/");
}
```

#### Method 2: Using Auth0's `withPageAuthRequired`

The easiest way to protect a page is using Auth0’s `withPageAuthRequired`:

```tsx
import { NextPage } from "next";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import React from "react";

const AuthProtected: NextPage = withPageAuthRequired(async () => {
  const session = await getSession();
  const user: any = session?.user;

  return (
    <div className="content-layout px-44">
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}, { returnTo: "/auth-protected" });

export default AuthProtected;
```


## Conclusion

This README provides a quick reference for integrating Auth0 with Next.js, including installation, route protection, and user data retrieval. You can further explore the [Auth0 Next.js SDK documentation](https://auth0.com/docs/quickstart/webapp/nextjs) for more advanced use cases and customization options.

---

This file is a comprehensive guide to setting up and using Auth0 with Next.js, helping you quickly review the core concepts and code snippets as needed.
