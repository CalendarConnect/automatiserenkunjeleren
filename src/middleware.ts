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
const isAuthRoute = createRouteMatcher(['/sign-in', '/sign-up'])

export default clerkMiddleware(async (auth, req) => {
  try {
    const { userId } = await auth()
    
    // Protect routes that require authentication
    if (isProtectedRoute(req)) {
      await auth.protect()
      
      // If user is authenticated and trying to access protected routes,
      // redirect to onboarding if they haven't completed it
      // Note: We'll let the client-side components handle the detailed onboarding check
      // since we need Convex data to determine if profile is complete
    }
    
    // If user is authenticated and tries to access auth routes, redirect to community
    if (isAuthRoute(req) && userId) {
      return NextResponse.redirect(new URL('/community', req.url))
    }
    
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/sign-in', req.url))
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