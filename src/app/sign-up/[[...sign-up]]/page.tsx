import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { Brain, ArrowLeft } from 'lucide-react'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header with branding */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="flex items-center space-x-2 text-slate-700 hover:text-blue-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Automatiseren Kun Je Leren</span>
          </div>
        </Link>
      </div>

      {/* Sign-up form */}
      <div className="flex items-center justify-center min-h-screen p-6">
        <SignUp 
          forceRedirectUrl="/onboarding"
          fallbackRedirectUrl="/onboarding"
          redirectUrl="/onboarding"
          afterSignUpUrl="/onboarding"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              footer: { display: "none !important" },
              footerText: { display: "none !important" },
              footerPages: { display: "none !important" },
              footerPagesLink: { display: "none !important" },
              poweredBy: { display: "none !important" },
              clerkBranding: { display: "none !important" },
              headerTitle: {
                fontSize: "1.875rem",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "0.5rem",
                textAlign: "center",
              },
              headerSubtitle: {
                color: "#64748b",
                fontSize: "1rem",
                textAlign: "center",
                marginBottom: "2rem",
              },
            }
          }}
        />
      </div>
    </div>
  )
} 