import Navbar from "@/components/navbar"

export default function NavbarExample() {
  return (
    <>
      <Navbar />

      {/* Page sections (for demonstration) */}
      <section id="home" className="min-h-screen bg-purple-50 dark:bg-gray-900 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-center">Anywhere AI Home</h1>
      </section>

      <section id="how-it-works" className="min-h-screen bg-white dark:bg-gray-800 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-center">How It Works</h1>
      </section>

      <section id="features" className="min-h-screen bg-purple-50 dark:bg-gray-900 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-center">Features</h1>
      </section>

      <section id="generate" className="min-h-screen bg-white dark:bg-gray-800 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-center">Generate Guide</h1>
      </section>

      <section id="contact" className="min-h-screen bg-purple-50 dark:bg-gray-900 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-center">Contact</h1>
      </section>
    </>
  )
}
