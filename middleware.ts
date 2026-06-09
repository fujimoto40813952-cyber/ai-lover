import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware is minimal — auth is handled in individual server components
// Supabase @supabase/supabase-js is not Edge Runtime compatible
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
