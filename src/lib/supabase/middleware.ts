/**
 * Middleware helper: refresca la sesión de Supabase en cada request y
 * redirige a /login si la ruta requiere auth.
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/welcome", "/login", "/signup", "/auth/callback", "/auth/confirm", "/api/health"];

function isPublic(pathname: string) {
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return true;
  // Assets de Next y favicon
  if (pathname.startsWith("/_next/") || pathname === "/favicon.ico") return true;
  return false;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  if (!user && !isPublic(pathname)) {
    // API routes responden con 401 JSON en lugar de redirigir.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Sesión requerida" } },
        { status: 401 },
      );
    }
    const url = request.nextUrl.clone();
    // Visitantes que aterricen en "/" ven el landing público;
    // cualquier otra ruta protegida los manda al login.
    if (pathname === "/") {
      url.pathname = "/welcome";
    } else {
      url.pathname = "/login";
      url.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(url);
  }
  if (user && (pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}
