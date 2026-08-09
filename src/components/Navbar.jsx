import React, { useState, useRef, useEffect } from 'react'
import AuthMode from './AuthMode'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'motion/react'
import { BsRobot, BsCoin } from 'react-icons/bs'
import { FaUserAstronaut } from "react-icons/fa6";
import { HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import axios from "axios"

import { setUserData } from "../redux/userSlice"
import {ServerUrl} from '../App';

export default function Navbar() {
  const { user: userData } = useSelector((state) => state.user)

  const [showCreditPopup, setShowCreditPopup] = useState(false)
  const [showUserPopup, setShowUserPopup] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentMessage, setPaymentMessage] = useState('')
  const [paymentForm, setPaymentForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    amount: 100,
    packageName: 'Starter Pack'
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const userRef = useRef()
  const modalRef = useRef()

  const creditPackages = [
    { name: 'Starter Pack', amount: 100, description: '100 credits • Instant top-up' },
    { name: 'Pro Pack', amount: 500, description: '500 credits • Best value' },
  ]

  // ✅ Close dropdown & modal on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserPopup(false)
      }
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowCreditPopup(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // ✅ Logout Function (Fixed)
  const handleLogout = async () => {
    try {
      await axios.get(`${ServerUrl}/api/auth/logout`, {
        withCredentials: true,
      })

      dispatch(setUserData(null))
      setShowUserPopup(false)
      navigate("/")

    } catch (error) {
      console.error("Logout Error:", error)
    }
  }

  const handleSelectPackage = (pkg) => {
    setPaymentForm({
      cardName: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
      amount: pkg.amount,
      packageName: pkg.name
    })
    setPaymentMessage('')
    setShowPaymentForm(true)
  }

  const handlePaymentChange = (event) => {
    const { name, value } = event.target
    setPaymentForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleBuyCredits = async (event) => {
    event.preventDefault()

    if (!userData) {
      setShowCreditPopup(false)
      setShowAuth(true)
      return
    }

    try {
      const response = await axios.post(`${ServerUrl}/api/user/add-credits`, {
        amount: paymentForm.amount,
        packageName: paymentForm.packageName,
        cardName: paymentForm.cardName,
        cardNumber: paymentForm.cardNumber,
        expiry: paymentForm.expiry,
        cvv: paymentForm.cvv,
      }, {
        withCredentials: true,
      })

      dispatch(setUserData({ ...userData, credits: response.data.credits }))
      setPaymentMessage(`Payment successful. ${response.data.credits} credits added.`)
      setShowPaymentForm(false)
      setPaymentForm((prev) => ({ ...prev, cardName: '', cardNumber: '', expiry: '', cvv: '' }))
    } catch (error) {
      setPaymentMessage(error.response?.data?.message || 'Payment failed. Please try again.')
    }
  }

  return (
    <div className="bg-[#f3f3f3] flex justify-center px-4 py-6">

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 px-6 md:px-8 py-4 flex justify-between items-center relative"
      >

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="bg-black text-white p-2 rounded-lg w-9 h-9 flex items-center justify-center">
           
              <BsRobot size={18} />
            
          </div>
          <h1 className="font-semibold hidden md:block text-lg">
            InterviewIQ.AI
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Coins */}
          <div
            onClick={() => setShowCreditPopup(true)}
            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
          >
            <BsCoin size={18} />
            <span className="text-sm font-medium">
              {userData?.credits || 0}
            </span>
          </div>

          {/* Avatar + Dropdown */}
          <div ref={userRef} className="relative">
            <div
              onClick={() => setShowUserPopup(!showUserPopup)}
              className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full text-sm font-semibold cursor-pointer"
            >
              {userData?.name
                ? userData.name.slice(0, 1).toUpperCase()
                : <FaUserAstronaut size={16} />
              }
            </div>

            {/* Dropdown */}
            {showUserPopup && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-3 bg-white border rounded-xl shadow-lg w-52 p-2 z-50"
              >
                <div className="px-3 py-2 text-sm font-semibold border-b mb-1">
                  {userData ? (userData.name || "User") : "Welcome!"}
                </div>

                {userData ? (
                  <>
                    <button
                      onClick={() => {
                        setShowUserPopup(false)
                        navigate('/profile')
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-sm"
                    >
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        setShowUserPopup(false)
                        navigate('/dashboard')
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-sm"
                    >
                      Interview History
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-100 text-red-500 rounded-lg text-sm"
                    >
                      <HiOutlineLogout size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setShowUserPopup(false)
                      setShowAuth(true)
                    }}
                    className="w-full text-center px-3 py-2 bg-black text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
                  >
                    Login / Sign Up
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* CREDIT MODAL */}
      {showCreditPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <motion.div
            ref={modalRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative"
          >

            <button
              onClick={() => setShowCreditPopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">Your Credits</h2>

            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl mb-4">
              <div className="flex items-center gap-2">
                <BsCoin />
                <span className="font-medium">Available</span>
              </div>
              <span className="font-semibold text-lg">
                {userData?.credits || 0}
              </span>
            </div>

            {paymentMessage && (
              <div className="mb-3 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-700">
                {paymentMessage}
              </div>
            )}

            {!showPaymentForm ? (
              <div className="space-y-3 mb-4">
                {creditPackages.map((pkg) => (
                  <div key={pkg.name} className="border rounded-xl p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-sm">{pkg.name}</p>
                        <p className="text-xs text-gray-500">{pkg.description}</p>
                      </div>
                      <button
                        onClick={() => handleSelectPackage(pkg)}
                        className="bg-black text-white px-3 py-2 rounded-lg text-sm hover:opacity-90"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleBuyCredits} className="space-y-3 mb-4">
                <div className="text-sm font-semibold">Pay with card</div>
                <div className="rounded-xl border p-3 space-y-3">
                  <input
                    name="cardName"
                    value={paymentForm.cardName}
                    onChange={handlePaymentChange}
                    placeholder="Card holder name"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    required
                  />
                  <input
                    name="cardNumber"
                    value={paymentForm.cardNumber}
                    onChange={handlePaymentChange}
                    placeholder="Card number"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    required
                    maxLength={16}
                  />
                  <div className="flex gap-2">
                    <input
                      name="expiry"
                      value={paymentForm.expiry}
                      onChange={handlePaymentChange}
                      placeholder="MM/YY"
                      className="w-1/2 border rounded-lg px-3 py-2 text-sm"
                      required
                      maxLength={5}
                    />
                    <input
                      name="cvv"
                      value={paymentForm.cvv}
                      onChange={handlePaymentChange}
                      placeholder="CVV"
                      className="w-1/2 border rounded-lg px-3 py-2 text-sm"
                      required
                      maxLength={4}
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Package: <span className="font-semibold">{paymentForm.packageName}</span> • {paymentForm.amount} credits
                  </div>
                </div>
                <button type="submit" className="w-full bg-black text-white py-2 rounded-xl hover:opacity-90">
                  Pay & Add Credits
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentForm(false)}
                  className="w-full border py-2 rounded-xl hover:bg-gray-100"
                >
                  Back
                </button>
              </form>
            )}

            <p className="text-xs text-gray-500 mb-4">This is a secure test checkout simulation. No real money is charged.</p>

            <button
              onClick={() => setShowCreditPopup(false)}
              className="w-full border py-2 rounded-xl hover:bg-gray-100"
            >
              Close
            </button>

          </motion.div>
        </div>
      )}

      {showAuth && <AuthMode onClose={() => setShowAuth(false)} />}

    </div>
  )
}