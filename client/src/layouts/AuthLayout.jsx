import heroImage from '../assets/hero.png'

export default function AuthLayout({ children }) {
  return (
    <main className="min-h-screen w-full bg-white lg:grid lg:grid-cols-2">
      <section className="flex min-h-screen w-full items-center justify-center px-6 py-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-[480px]">
          {children}
        </div>
      </section>

      <aside className="hidden min-h-screen items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] p-12 lg:flex">
        <img
          src={heroImage}
          alt=""
          className="max-h-[72vh] w-full max-w-lg object-contain"
          aria-hidden="true"
        />
      </aside>
    </main>
  )
}
