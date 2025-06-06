import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/beheer(.*)',
  '/profiel(.*)',
  '/nieuw(.*)',
  '/community(.*)',
  '/kanaal(.*)',
  '/kanalen(.*)',
  '/thread(.*)',
])

const isOnboardingRoute = createRouteMatcher(['/onboarding'])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  
  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect()
    
    // If user is authenticated but not on onboarding page, check if they need onboarding
    if (userId && !isOnboardingRoute(req)) {
      // For now, we'll let the onboarding page itself handle the redirect logic
      // since we need to check the Convex user data to see if profile is complete
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
} 