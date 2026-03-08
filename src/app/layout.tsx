import './globals.css';
import { Providers } from "@/components/providers";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { LayoutDashboard, LogIn, UserPlus, LogOut } from "lucide-react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" className="dark">
      <body className="bg-black">
        <Providers>
          {/* Global Navbar */}
          <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl h-16 flex items-center justify-between px-8">
            <Link href="/" className="flex items-center gap-2 group transition-all duration-300">
              <div className="h-8 w-8 bg-linear-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all">
                <LayoutDashboard className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Akaal</span>
            </Link>

            <div className="flex items-center gap-6">
              {session ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/" });
                    }}
                  >
                    <button
                      type="submit"
                      className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link 
                    href="/login" 
                    className="text-sm font-medium text-gray-300 hover:text-white flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-full transition-all"
                  >
                    <LogIn size={16} />
                    Log In
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
                  >
                    <UserPlus size={16} />
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </nav>
          
          <main className="pt-16">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
