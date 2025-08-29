import Link from "next/link"
import { Github, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer
      id="footer"
      className="bg-purple-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 py-6 pb-14 w-full mt-16 rounded-t-2xl shadow-inner transition-colors duration-300 border-t border-purple-100 dark:border-gray-800"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-8">
          {/* Left section */}
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm text-gray-800 dark:text-gray-100">© 2025 Welcome Anywhere</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Built with ❤️ for hackathon</p>
          </div>

          {/* Middle section */}
          <div className="flex flex-col space-y-2.5">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Contributors</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>
                <Link
                  href="https://github.com/binitkarki"
                  className="hover:text-purple-600 dark:hover:text-purple-400 text-gray-600 dark:text-gray-400 transition-colors"
                >
                  Binit Karki
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-purple-600 dark:hover:text-purple-400 text-gray-600 dark:text-gray-400 transition-colors"
                >
                  Naresh Chhetri
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-purple-600 dark:hover:text-purple-400 text-gray-600 dark:text-gray-400 transition-colors"
                >
                  Lochan Acharya
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-purple-600 dark:hover:text-purple-400 text-gray-600 dark:text-gray-400 transition-colors"
                >
                  Pankaj Bhatta
                </Link>
              </li>
            </ul>
          </div>

          {/* Right section */}
          <div className="flex flex-col space-y-2.5">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Contact us</h3>
            <div className="space-y-2">
              <Link
                href="mailto:hello@welcomeanywhere.ai"
                className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
                hello@welcomeanywhere.ai
              </Link>
              <Link
                href="https://github.com/vinnyboi7/welcome-anywhere-app"
                className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
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
