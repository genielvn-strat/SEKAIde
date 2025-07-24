// TODO: Task 2.2 - Configure authentication middleware for route protection
import { authMiddleware } from "@clerk/nextjs"

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up", "/api/webhooks/clerk"],
  ignoredRoutes: [],
})


// Placeholder middleware - currently allows all routes for development
// TODO: Replace with actual Clerk authMiddleware when authentication is implemented
// export default function middleware() {
//   // TODO: Implement actual authentication middleware
//   // For now, allow all routes so interns can navigate and see the mock pages
//   console.log("TODO: Implement Clerk authentication middleware")

//   // Return undefined to allow all requests through
//   return undefined
// }


/*
TODO: Task 2.2 Implementation Notes for Interns:
- Install and configure Clerk
- Set up authMiddleware to protect routes
- Configure public routes: ["/", "/sign-in", "/sign-up"]
- Protect all dashboard routes: ["/dashboard", "/projects"]
- Add proper redirects for unauthenticated users

Example implementation when ready:

*/
