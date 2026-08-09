import React from "react"
import { BsRobot, BsTwitter, BsLinkedin, BsGithub } from "react-icons/bs"
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className=" border-t border-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-black text-white p-2 rounded-lg">
              <BsRobot size={22} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">InterviewIQ.AI</h2>
          </div>
          <p className="text-gray-500 text-lg leading-relaxed max-w-sm">
            Elevating your career through AI-powered mock interviews and real-time performance analytics.
          </p>
          <div className="flex gap-5 mt-8">
            <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
              <BsTwitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
              <BsLinkedin size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
              <BsGithub size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-gray-900 font-bold mb-6 uppercase tracking-wider text-sm">Platform</h3>
          <ul className="flex flex-col gap-4">
            <li>
              <Link to="/" className="text-gray-500 hover:text-green-600 transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/interview" className="text-gray-500 hover:text-green-600 transition-colors">Start Interview</Link>
            </li>
            <li>
              <Link to="/history" className="text-gray-500 hover:text-green-600 transition-colors">History</Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-gray-900 font-bold mb-6 uppercase tracking-wider text-sm">Legal</h3>
          <ul className="flex flex-col gap-4">
            <li>
              <a href="#" className="text-gray-500 hover:text-green-600 transition-colors">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-green-600 transition-colors">Terms of Service</a>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-green-600 transition-colors">Cookie Policy</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto border-t border-gray-100 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} InterviewIQ.AI. All rights reserved.
        </p>
        <p className="text-gray-400 text-sm flex items-center gap-1">
          Made with ❤️ for better careers
        </p>
      </div>
    </footer>
  )
}
