# Implement Login

Implement login functionality similar to the txn app authentication flow.

## Reference Implementation

Based on `/Users/alex/ec2code/cashflowy/txn.fobrix.com` - a mature project using:
- **next-auth v5.0.0-beta.4** with Google provider
- **@auth/sequelize-adapter** for database-backed sessions
- **PostgreSQL** with Sequelize ORM

## Implementation Plan

### Phase 1: Install Dependencies

```bash
npm install next-auth@5.0.0-beta.4 @auth/sequelize-adapter
```

Note: Sequelize and pg should already be present if following txn.fobrix.com patterns.

### Phase 2: Create Auth Database Schema

Create auth tables in the `auth` schema:

**Files to create:**
- [ ] `src/database/models/Users.model.js`
- [ ] `src/database/models/AuthAccounts.model.js`
- [ ] `src/database/models/Sessions.model.js`
- [ ] `src/database/models/VerificationTokens.model.js`

**Schema Structure:**

```
auth.users
├── id (TEXT, PK, UUID)
├── name (TEXT)
├── email (TEXT, unique)
├── emailVerified (BOOLEAN)
└── image (TEXT)

auth.accounts
├── id (UUID, PK)
├── type (STRING)
├── provider (STRING) - "google"
├── provider_account_id (STRING)
├── refresh_token (STRING)
├── access_token (STRING)
├── expires_at (INTEGER)
├── token_type (STRING)
├── scope (STRING)
├── id_token (TEXT)
├── session_state (STRING)
└── user_id (TEXT, FK → users.id)

auth.sessions
├── id (UUID, PK)
├── expires (DATE)
├── session_token (STRING, unique)
└── user_id (TEXT, FK → users.id)

auth.verification_tokens
├── token (STRING)
├── identifier (STRING)
└── expires (DATE)
```

### Phase 3: Create Auth Configuration

**Files to create:**

- [ ] `src/auth/index.js` - Main NextAuth configuration

```javascript
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import SequelizeAdapter from "@auth/sequelize-adapter"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: SequelizeAdapter(sequelize, {
    models: { User, Account, Session, VerificationToken }
  }),
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    }
  }
})
```

- [ ] `src/auth/action.js` - Server actions for login

```javascript
"use server"
import { signIn } from "@/auth"

export async function loginWithGoogle() {
  return await signIn("google", { redirectTo: "/orgs" })
}
```

### Phase 4: Create API Route Handler

- [ ] `src/app/api/auth/[...nextauth]/route.js`

```javascript
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

### Phase 5: Create Auth Policy/Middleware

- [ ] `src/policies/loginRequired.js`

```javascript
import 'server-only'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function loginRequired(){
  const session = await auth()
  const user = session?.user
  if(!user)
    redirect('/login')
  return user
}
```

### Phase 6: Create Login UI Components

**Files to create:**

- [ ] `src/app/(auth)/login/page.jsx` - Login page (server component)
- [ ] `src/app/(auth)/login/Login.jsx` - Login UI component
- [ ] `src/app/(auth)/login/GoogleAuthButton.jsx` - Client component for Google login
- [ ] `src/components/GoogleIcon.jsx` - Google brand SVG icon

**GoogleAuthButton.jsx pattern:**
```javascript
'use client'
import { useState } from 'react'
import { loginWithGoogle } from '@/auth/action'
import { Button } from '@/components/ui/button'
import GoogleIcon from '@/components/GoogleIcon'

export default function GoogleAuthButton() {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error('Google login error:', error)
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleGoogleLogin} disabled={loading}>
      <GoogleIcon className="mr-2 h-4 w-4" />
      {loading ? 'Logging in...' : 'Login with Google'}
    </Button>
  )
}
```

### Phase 7: Add Logout to Navbar

- [ ] Update `src/components/Navbar/NavbarContainer.jsx` with signOut

```javascript
import { signOut } from '@/auth'

async function signOutFn() {
  'use server'
  await signOut()
  redirect('/login')
}
```

### Phase 8: Environment Variables

Add to `.env.local`:

```
AUTH_SECRET=<generate with: openssl rand -base64 32>
AUTH_GOOGLE_ID=<from Google Cloud Console>
AUTH_GOOGLE_SECRET=<from Google Cloud Console>
APP_URL=http://localhost:3000

DB_AUTH=postgresql://user:pass@host:5432/auth
```

### Phase 9: Google Cloud Console Setup

1. Go to https://console.cloud.google.com
2. Create OAuth 2.0 credentials
3. Set authorized redirect URI: `{APP_URL}/api/auth/callback/google`
4. Copy Client ID and Client Secret to `.env.local`

## File Checklist Summary

### New Files to Create:
- [ ] `src/auth/index.js`
- [ ] `src/auth/action.js`
- [ ] `src/app/api/auth/[...nextauth]/route.js`
- [ ] `src/policies/loginRequired.js`
- [ ] `src/app/(auth)/login/page.jsx`
- [ ] `src/app/(auth)/login/Login.jsx`
- [ ] `src/app/(auth)/login/GoogleAuthButton.jsx`
- [ ] `src/components/GoogleIcon.jsx`
- [ ] `src/database/models/Users.model.js`
- [ ] `src/database/models/AuthAccounts.model.js`
- [ ] `src/database/models/Sessions.model.js`
- [ ] `src/database/models/VerificationTokens.model.js`

### Files to Modify:
- [ ] `src/components/Navbar/NavbarContainer.jsx` - Add logout
- [ ] `src/database/sequelize.js` - Add auth database connection
- [ ] `.env.local` - Add auth environment variables
- [ ] Protected pages - Add `loginRequired()` check

## Key Implementation Notes

1. **Database-backed sessions** (not JWT) - More secure, allows server-side session revocation
2. **Route group `(auth)`** - Keeps login page separate from main layout
3. **Server actions** - `loginWithGoogle()` uses server action pattern
4. **Policy pattern** - `loginRequired()` is reusable across protected pages
5. **Two databases** - Separate auth database from app database

## Testing Checklist

- [ ] User can click "Login with Google"
- [ ] OAuth redirect to Google works
- [ ] Callback creates user in database
- [ ] Session is created and stored
- [ ] Protected routes redirect unauthenticated users
- [ ] Logout clears session and redirects to login
- [ ] Session persists across page refreshes
