import { useState, useRef } from 'react'
import { motion } from "motion/react"
import { FaBriefcase, FaChartLine, FaUserTie, FaSpinner, FaRocket, FaCode } from 'react-icons/fa6'
import { FaMicrophoneAlt, FaCheckCircle, FaFileUpload } from 'react-icons/fa'
import axios from 'axios'
import { ServerUrl } from '../App'
import { useSelector, useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

export default function Step1SetUp({ onStart }) {
    const [role, setRole] = useState("")
    const [experience, setExperience] = useState("")
    const [mode, setMode] = useState("Technical")
    const [loading,setLoading] = useState(false)
    const [resumeFile, setResumeFile] = useState(null)
    const [analysisDone, setAnalysisDone] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
    // Additional states for resume data
    const [skills, setSkills] = useState([])
    const [projects, setProjects] = useState([])
    const [resumeText, setResumeText] = useState("")

    const fileInputRef = useRef(null)
    const { user: userData } = useSelector((state) => state.user)
    const dispatch = useDispatch()


    const interviewFeatures = [
        {
            icon: <FaUserTie className='text-green-600 text-xl' />,
            role: "Choose Role & Experience",
        },
        {
            icon: <FaMicrophoneAlt className='text-green-600 text-xl' />,
            role: "Smart Voice interview",
        },
        {
            icon: <FaChartLine className='text-green-600 text-xl' />,
            role: "Performance Analytics",
        },
    ]

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setResumeFile(file)
            setAnalysisDone(false)
        }
    }

    const resumeUpload = async () => {
        if (!resumeFile || analyzing) return
        setAnalyzing(true)
        
        const formData = new FormData()
        formData.append("resume", resumeFile)

        try {
            const result = await axios.post(ServerUrl + "/api/interview/resume", formData, {
                withCredentials: true
            })
            
            setRole(result.data.role || "")
            setExperience(result.data.experience || "")
            setSkills(result.data.skills || [])
            setProjects(result.data.projects || [])
            setResumeText(result.data.resumeText || "")
            
            setAnalysisDone(true)
            setAnalyzing(false)
        } catch (error) {
            console.error("Upload Error:", error)
            setAnalyzing(false)
        }
    }

    const handleStart = async () => {
           setLoading(true)
        try {
         const result = await axios.post(ServerUrl + "/api/interview/generate-questions",{role,experience,mode,resumeText,projects,skills},{withCredentials:true})
         console.log(result.data)
         if (userData) {
            dispatch(setUserData({ ...userData, credits: result.data.creditLeft }))
         }
         setLoading(false)
         onStart(result.data)
        } catch (error) {
            console.log(error)
            setLoading(false)
            alert(error.response?.data?.message || "Failed to generate questions. Please try again.")
        }
    }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-12'
        >
            <div className='w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden border border-gray-100'>
                {/* Left Column: Info */}
                <motion.div
                    initial={{ opacity: 0, x: -80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className='relative bg-gradient-to-br from-green-50 to-green-100 p-12 flex flex-col justify-center'
                >
                    <h1 className='text-2xl md:text-4xl font-bold text-gray-900 mb-6'>
                        Start Your AI Interview
                    </h1>
                    <p className='text-gray-600 mb-8 leading-relaxed'>
                        AI interview preparation platform that helps you prepare for your next interview by providing personalized feedback and suggestions.
                    </p>

                    <div className='space-y-5'>
                        {interviewFeatures.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.15 }}
                                whileHover={{ scale: 1.03 }}
                                className='flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm cursor-pointer border border-green-100'
                            >
                                {item.icon}
                                <span className='text-gray-700 font-medium'>{item.role}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Column: Setup Form */}
                <motion.div
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className='p-12 md:p-16 flex flex-col justify-center'
                >
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Interview Setup</h2>
                            <p className="text-gray-500">Tell us about the position you're interviewing for.</p>
                        </div>

                        <div className="space-y-5">
                            <div className='flex flex-col gap-2'>
                                <label className="text-sm font-semibold text-gray-700 ml-1">Job Role / Position</label>
                                <div className='relative'>
                                    <FaUserTie className='absolute top-1/2 -translate-y-1/2 left-4 text-gray-400' />
                                    <input
                                        onChange={(e) => setRole(e.target.value)}
                                        value={role}
                                        type="text"
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition bg-gray-50/50"
                                        placeholder="e.g. Frontend Developer"
                                    />
                                </div>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label className="text-sm font-semibold text-gray-700 ml-1">Years of Experience</label>
                                <div className='relative'>
                                    <FaBriefcase className='absolute top-1/2 -translate-y-1/2 left-4 text-gray-400' />
                                    <input
                                        onChange={(e) => setExperience(e.target.value)}
                                        value={experience}
                                        type="text"
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition bg-gray-50/50"
                                        placeholder="e.g. 2 years"
                                    />
                                </div>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label className="text-sm font-semibold text-gray-700 ml-1">Interview Mode</label>
                                <select
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value)}
                                    className='w-full py-3.5 px-4 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition bg-gray-50/50 cursor-pointer text-gray-700 appearance-none'
                                >
                                    <option value="Technical">Technical Interview</option>
                                    <option value="HR">HR Interview</option>
                                </select>
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label className="text-sm font-semibold text-gray-700 ml-1">Upload Resume (Optional)</label>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                />
                                
                                {!analysisDone ? (
                                    <motion.div 
                                        onClick={() => fileInputRef.current?.click()}
                                        whileHover={{ borderColor: '#22c55e', backgroundColor: '#f0fdf4', scale: 1.01 }}
                                        className='border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 group'
                                    >
                                        {analyzing ? (
                                            <>
                                                <FaSpinner className="text-green-600 text-2xl animate-spin" />
                                                <p className="text-sm font-medium text-gray-600">Analyzing Resume...</p>
                                            </>
                                        ) : (
                                            <>
                                                <FaFileUpload className='text-gray-400 text-2xl group-hover:text-green-600 transition-colors' />
                                                <div className='flex flex-col items-center'>
                                                    <p className='text-sm font-semibold text-gray-700'>
                                                        {resumeFile ? resumeFile.name : "Click to upload resume"}
                                                    </p>
                                                    <p className='text-xs text-gray-400 mt-1'>PDF only, max 5MB</p>
                                                    {resumeFile && (
                                                        <motion.button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                resumeUpload()
                                                            }}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="mt-3 bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-green-700 transition"
                                                        >
                                                            Analyze Resume
                                                        </motion.button>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                ) : (
                                    <div className='flex flex-wrap items-center justify-between bg-green-50 border border-green-200 p-4 rounded-xl'>
                                        <div className='flex items-center gap-3'>
                                            <FaCheckCircle className='text-green-600 text-xl' />
                                            <div>
                                                <p className='text-sm font-semibold text-gray-800'>{resumeFile?.name}</p>
                                                <p className='text-xs text-green-600 font-medium'>AI Analysis successful!</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setAnalysisDone(false)
                                                setResumeFile(null)
                                                setRole("")
                                                setExperience("")
                                                setSkills([])
                                                setProjects([])
                                            }}
                                            className='text-xs text-red-500 cursor-pointer hover:text-red-700 font-bold '
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Analysis Result Display */}
                            {analysisDone && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-green-50/50 border border-green-100 rounded-2xl p-6 space-y-5 shadow-sm"
                                >
                                    <div>
                                        <div className='flex items-center gap-2 mb-4'>
                                            <div className='bg-green-100 p-1.5 rounded-lg'>
                                                <FaCode className='text-green-600 text-xs' />
                                            </div>
                                            <h3 className='text-xs font-extrabold text-gray-700 uppercase tracking-widest'>Detected Skills</h3>
                                        </div>
                                        <div className='flex flex-wrap gap-2'>
                                            {(Array.isArray(skills) ? skills : []).map((skill, i) => (
                                                <span key={i} className='bg-white text-green-700 text-[11px] font-bold px-4 py-1.5 rounded-full border border-green-50 shadow-sm'>
                                                    {typeof skill === 'object' ? skill.name || skill.skill || 'Skill' : skill}
                                                </span>
                                            ))}
                                            {!Array.isArray(skills) && typeof skills === 'string' && (
                                                <span className='bg-white text-green-700 text-[11px] font-bold px-4 py-1.5 rounded-full border border-green-50 shadow-sm'>
                                                    {skills}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className='pt-2'>
                                        <div className='flex items-center gap-2 mb-4'>
                                            <div className='bg-green-100 p-1.5 rounded-lg'>
                                                <FaRocket className='text-green-600 text-xs' />
                                            </div>
                                            <h3 className='text-xs font-extrabold text-gray-700 uppercase tracking-widest'>Key Projects</h3>
                                        </div>
                                        <ul className='space-y-3'>
                                            {(Array.isArray(projects) ? projects : []).map((proj, i) => (
                                                <li key={i} className='text-[13px] text-gray-600 flex items-start gap-3 bg-white/50 p-3 rounded-xl border border-green-50/50'>
                                                    <div className='w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0' />
                                                    <span className='leading-relaxed'>
                                                        {typeof proj === 'object' ? (
                                                            <>
                                                                <strong className='text-gray-900 block mb-0.5'>{proj.name || proj.title}</strong>
                                                                <span className='text-gray-500 text-xs'>{proj.description}</span>
                                                            </>
                                                        ) : proj}
                                                    </span>
                                                </li>
                                            ))}
                                            {!Array.isArray(projects) && typeof projects === 'string' && (
                                                <li className='text-[13px] text-gray-600 flex items-start gap-3 bg-white/50 p-3 rounded-xl border border-green-50/50'>
                                                    <div className='w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0' />
                                                    <span className='leading-relaxed'>{projects}</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={!( !role.trim() || !experience.trim() || analyzing || loading) ? { scale: 1.02 } : {}}
                                whileTap={!( !role.trim() || !experience.trim() || analyzing || loading) ? { scale: 0.98 } : {}}
                                disabled={!role.trim() || !experience.trim() || analyzing || loading}
                                onClick={handleStart}
                                className={`w-full rounded-full font-bold transition-all duration-300 p-4 mt-4 shadow-lg 
                                    ${(!role.trim() || !experience.trim() || analyzing || loading) 
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                                        : 'bg-green-600 text-white cursor-pointer hover:bg-green-700 hover:shadow-green-100'
                                    }`}
                            >
                                {analyzing || loading ? 'Processing...' : 'Start Interview'}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
