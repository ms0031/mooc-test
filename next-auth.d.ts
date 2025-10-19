import 'next-auth';
import 'next-auth/jwt';

// Declare and extend the built-in session and user types
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: string;
      provider?: string; // Add your custom property
    } & DefaultSession['user']; // Keep the default properties
  }
}

// Declare and extend the built-in JWT type
declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and sent to the `session` callback. */
  interface JWT {
    provider?: string; // Add your custom property
    role?: string;
  }
}