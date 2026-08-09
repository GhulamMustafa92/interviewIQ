import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { BsRobot, BsMic, BsClock, } from "react-icons/bs"
import { HiSparkles } from "react-icons/hi"
import { FaHistory, FaSignal } from "react-icons/fa"
import { IoDocumentTextOutline } from "react-icons/io5"
import { motion } from "motion/react"
import AuthMode from "../components/AuthMode"
import Footer from "../components/Footer"

export default function Home() {
  const { user: userData } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [showAuth, setShowAuth] = useState(false)

  const handleNavigation = (path) => {
    if (!userData) return setShowAuth(true)
    navigate(path)
  }

  const steps = [
    {
      icon: <BsRobot size={22} />,
      step: "STEP 1",
      title: "Role & Experience Selection",
      desc: "AI adjusts difficulty based on selected job role.",
      rotate: "-rotate-3",
    },
    {
      icon: <BsMic size={22} />,
      step: "STEP 2",
      title: "Smart Voice Interview",
      desc: "Dynamic follow-up questions based on your answers.",
      rotate: "rotate-2",
    },
    {
      icon: <BsClock size={22} />,
      step: "STEP 3",
      title: "Timer Based Simulation",
      desc: "Real interview pressure with time tracking",
      rotate: "-rotate-2",
    },
  ]

  const Capabilities = [
    {
      image: "/ai-ans.png",
      title: "AI Answer Evaluation",
      desc: "Receive detailed feedback, scoring, and suggestions to improve your responses.",
      icon: <FaSignal />,
    },
    {
      image: "/resume.png",
      title: "Resume Based Interview",
      desc: "Receive detailed feedback, scoring, and suggestions to improve your responses.",
      icon: <IoDocumentTextOutline />,
    },
    {
      image: "/pdf.png",
      title: "Download PDF",
      desc: "Receive detailed feedback, scoring, and suggestions to improve your responses.",
      icon: <IoDocumentTextOutline />,
    },
    {
      image: "/history.png",
      title: "History & Analytics",
      desc: "Receive detailed feedback, scoring, and suggestions to improve your responses.",
      icon: <FaSignal />,
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#f5f5f5] px-6 py-24">
        <div>
          <div className="flex justify-center mb-10">
            <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
              <HiSparkles size={16} className="text-green-600" />
              AI Power Smart Interview Platform
            </div>
          </div>

          <div className="text-center mb-24">
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto"
            >
              Practice Interview with
              <span className="ml-3 inline-block bg-green-100 text-green-600 px-5 py-1 rounded-full">
                AI intelligent
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg"
            >
              Role-based mock interviews with smart follow-ups, adaptive difficulty and real-time performance evaluation.
            </motion.p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <motion.button
                onClick={() => handleNavigation("/interview")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-10 py-3 cursor-pointer bg-black text-white rounded-full shadow-sm hover:shadow-md transition"
              >
                <BsRobot size={20} />
                Start Interview
              </motion.button>

              <motion.button
                onClick={() => handleNavigation("/dashboard")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center cursor-pointer gap-2 px-6 py-3 bg-white text-black rounded-full border border-gray-200 hover:bg-gray-100 transition"
              >
                <FaHistory size={18} />
                View History
              </motion.button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-14 md:gap-10">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05, rotate: 0 }}
                className={`bg-white p-8 h-56 rounded-3xl border-2 transition-all duration-300 ease-in-out border-gray-100 hover:border-green-500 cursor-pointer text-center shadow-sm hover:shadow-lg w-full max-w-[320px] flex flex-col items-center justify-center gap-4 group relative ${item.rotate}`}
              >
                <div className="w-14 h-14 absolute -top-7 bg-white text-green-500 border-2 border-green-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className="mt-4">
                  <span className="text-xs font-bold text-green-600 tracking-wider uppercase">{item.step}</span>
                  <h3 className="text-xl font-semibold mt-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="bg-[#f5f5f5] pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Advanced AI <span className="text-green-600">Capabilities</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Capabilities.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 cursor-pointer bg-white rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center gap-8 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="w-50 h-50 rounded-[24px] p-6 flex-shrink-0 flex items-center justify-center">
                  <img src={item.image} alt={item.title} className="w-full h-full object-contain scale-110" />
                </div>
                <div className="text-center md:text-left flex-1">
                  <div className="p-2 w-fit bg-green-50 text-green-600 rounded-lg mb-4 mx-auto md:mx-0">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed mt-2">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Multiple Modes Section */}
      <section className="py-24 bg-[#f5f5f5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Multiple Interview <span className="text-green-600">Modes</span>
            </h2>
            <p className="text-gray-500 mt-4 text-lg">Choose the right mode to practice for your specific needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                image: "HR.png",
                title: "HR Interview Mode",
                desc: "Behavior and communication based evaluation to help you ace your soft skills.",
              },
              {
                image: "tech.png",
                title: "Technical Mode",
                desc: "Deep technical questioning based on your selected job role and seniority level.",
              },
              {
                image: "confi.png",
                title: "Confidence Detection",
                desc: "Tone and voice analysis to provide insights into your speaking confidence.",
              },
              {
                image: "tech.png",
                title: "Case Study Mode",
                desc: "Solve real-world business cases and scenarios with AI-driven feedback.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-whitesmoke cursor-pointer rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center gap-8 bg-white hover:shadow-lg group"
              >
              
                <div className="text-center md:text-left flex-1">
                 
                  <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed mt-2">{item.desc}</p>
                </div>
                  <div className="w-40 h-40  rounded-2xl p-4 shrink-0 flex items-center justify-center">
                  <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {showAuth && <AuthMode onClose={() => setShowAuth(false)} />}
        <Footer/>
    </>
  )
}