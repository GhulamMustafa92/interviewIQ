import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Auth from '../Pages/Auth'
import { motion, AnimatePresence } from 'motion/react'

export default function AuthMode({ onClose }) {
    const { user: userData } = useSelector((state) => state.user)

    useEffect(() => {
        if (userData) {
            onClose()
        }
    }, [userData, onClose])
    

    return (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4'>
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className='bg-white p-8 rounded-3xl shadow-2xl relative w-full max-w-md border border-gray-100'
            >
                <button 
                    onClick={onClose}
                    className='absolute top-4 right-4 text-gray-400 hover:text-black transition'
                >
                    ✕
                </button>
                
                <div className="mb-6">
                    <h2 className='text-2xl font-bold text-center text-gray-900'>Get Started</h2>
                    <p className='text-gray-500 text-center text-sm mt-2'>Join InterviewIQ to access AI mock interviews</p>
                </div>

                <Auth isModel={true} />
                
                <div className="mt-6 text-center">
                    <p className='text-xs text-gray-400 px-4'>
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
