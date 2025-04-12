import Link from "next/link"
import { Github, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-100 py-8 mt-16 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left section */}
          <div className="flex flex-col space-y-2">
            <p className="text-sm">© 2025 Welcome Anywhere</p>
            <p className="text-sm text-gray-400">Built with ❤️ for the Tech for Community Hackathon</p>
          </div>

          {/* Middle section */}
          <div className="flex flex-col space-y-3">
            <h3 className="font-medium text-gray-300">Contributors</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>
                <Link href="https://github.com/binitkarki" className="hover:text-purple-400 transition-colors">
                  Binit Karki
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400 transition-colors">
                  Pankaj Bhatta
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400 transition-colors">
                  Prasun Chhetri
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-400 transition-colors"></Link>
              </li>
            </ul>
          </div>

          {/* Right section */}
          <div className="flex flex-col space-y-3">
            <h3 className="font-medium text-gray-300">Contact us</h3>
            <div className="space-y-2">
              <Link
                href="mailto:hello@welcomeanywhere.ai"
                className="flex items-center text-sm text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
                hello@welcomeanywhere.ai
              </Link>
              <Link
                href="https://github.com/welcomeanywhere"
                className="flex items-center text-sm text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub Repository
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
