import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, user, token }) {
      const data = await (await fetch(process.env.NEXT_PUBLIC_API_URL+'/operator/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          session: session,
          user: user
        })
      })).json()
      session.token = token
      
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token
    }
  },
  secret: process.env.SECRET
}
export default NextAuth(authOptions)