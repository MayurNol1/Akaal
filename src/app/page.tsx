import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative isolate overflow-hidden bg-black min-h-screen flex items-center justify-center">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,#1a1a1a_0%,#000_100%)]" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-8 animate-pulse">
            <div className="h-20 w-20 bg-linear-to-tr from-blue-500 to-purple-600 rounded-2xl rotate-12 shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]" />
        </div>
        
        <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white to-gray-400 sm:text-7xl">
          Akaal Platform
        </h1>
        
        <p className="mt-6 text-lg leading-8 text-gray-400 max-w-2xl mx-auto">
          The next generation of seamless web experiences. 
          Built with cutting-edge technology for speed, security, and elegance.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/dashboard"
            className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300 hover:scale-105"
          >
            Go to Dashboard
          </Link>
          <div className="flex gap-4">
            <Link href="/login" className="text-sm font-semibold leading-6 text-white hover:text-blue-400 transition-colors">
              Log in <span aria-hidden="true">→</span>
            </Link>
            <Link href="/register" className="text-sm font-semibold leading-6 text-white hover:text-blue-400 transition-colors">
              Sign up <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


