import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  if ((path.startsWith('/dashboard') || path.startsWith('/admin')) && !user) {
    const target = request.nextUrl.clone(); target.pathname = '/login'; target.searchParams.set('next', path);
    return NextResponse.redirect(target);
  }
  if (path.startsWith('/admin') && user) {
    const { data: roleRow } = await supabase.from('web_roles').select('role').eq('user_id', user.id).maybeSingle();
    if (!roleRow || !['admin', 'owner'].includes(roleRow.role)) {
      const target = request.nextUrl.clone(); target.pathname = '/dashboard'; target.search = '';
      return NextResponse.redirect(target);
    }
  }
  return response;
}

export const config = { matcher: ['/dashboard/:path*', '/admin/:path*'] };
