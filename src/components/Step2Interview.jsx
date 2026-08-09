import React, { useEffect, useState, useRef } from 'react'
import { FaMicrophone } from 'react-icons/fa'
import maleVideo from "../assets/male-ai.mp4"
import femaleVideo from "../assets/female-ai.mp4"
import Timer from './Timer';
import axios from 'axios';
import { ServerUrl } from '../App';
export default function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60)
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");

  const [subtitle, setSubtitle] = useState("");
  const videoRef = useRef(null);


  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      // Try known female voices first 
      const femaleVoice = voices.find(v => v.name.toLowerCase().includes("zira")
        || v.name.toLowerCase().includes("samantha")
        || v.name.toLowerCase().includes("female"));
      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }


      const maleVoice = voices.find(v => v.name.toLowerCase().includes("david") || v.name.toLowerCase().includes("mark") || v.name.toLowerCase().includes("male"));
      if (maleVoice) { 
        setSelectedVoice(maleVoice); 
        setVoiceGender("male");
        return; 
      }

      // Fallback: first voice (assume female) 
      setSelectedVoice(voices[0]); 
      setVoiceGender("female");
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => window.speechSynthesis.onvoiceschanged = null;
  }, []);


const videoSorce = voiceGender === "female" ? femaleVideo : maleVideo;


  // SPEAK FUNCTION
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      // Add natural pauses after commas and periods
      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, " .... ");
      
      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92; 
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        if (videoRef.current) {
          videoRef.current.play().catch(e => console.log("Video play error:", e));
        }
      };

      utterance.onend = () => {
        setIsAIPlaying(false);
        if (videoRef.current) {
          videoRef.current.pause();
        }
        resolve();
      };

      utterance.onerror = () => {
        setIsAIPlaying(false);
        if (videoRef.current) {
          videoRef.current.pause();
        }
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  };
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    console.log("Interview Questions Object:", questions);
  }, [questions]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setAnswer(prev => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsMicOn(false);
      };
      
      recognitionRef.current.onend = () => {
         setIsMicOn(false);
      }
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isMicOn) {
      recognitionRef.current.stop();
      setIsMicOn(false);
    } else {
      recognitionRef.current.start();
      setIsMicOn(true);
    }
  };

  // Intro and Auto Speak
  useEffect(() => {
    const initInterview = async () => {
      if (isIntroPhase && selectedVoice) {
        const introText = `Hello ${userName}, welcome to your interview. Let's start with your first question.`;
        await speakText(introText);
        setIsIntroPhase(false);
        await speakText(questions[0].question);
      }
    };
    initInterview();
  }, [selectedVoice]);

  // Timer Countdown Logic
  useEffect(() => {
    if (isAIPlaying || isIntroPhase) return; 

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAIPlaying, isIntroPhase]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    if (recognitionRef.current && isMicOn) {
      recognitionRef.current.stop();
      setIsMicOn(false);
    }

    try {
      await axios.post(`${ServerUrl}/api/interview/submit-answer`, {
        interviewId,
        questionIndex: currentIndex,
        answer: answer.trim(),
        timeTaken: (currentQuestion.timeLimit || 60) - timeLeft
      }, { withCredentials: true });

      if (currentIndex < questions.length - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setAnswer("");
        setTimeLeft(questions[nextIndex]?.timeLimit || 60);
        await speakText(questions[nextIndex].question);
      } else {
        const finishRes = await axios.post(`${ServerUrl}/api/interview/finish`, {
          interviewId
        }, { withCredentials: true });
        
        onFinish(finishRes.data);
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-teal-100 flex items-center justify-center p-3 sm:p-6">
        <div className="max-w-[1400px] min-h-[80vh] bg-white rounded-3xl shadow-2xl flex flex-col lg:flex-row gap-4 lg:gap-6 overflow-hidden border border-gray-200 p-3 sm:p-4 w-full mx-auto">
          {/* video seciton */}
          <div className="lg:w-[35%] w-full min-h-[400px] lg:h-auto bg-white rounded-2xl shadow-inner flex flex-col items-center p-4 sm:p-6 space-y-6 lg:border-r lg:border-gray-200">
            <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-md'>
              <video
                muted
                playsInline
                loop
                key={videoSorce}
                ref={videoRef}
                preload='auto'
                className='w-full h-full object-cover aspect-video md:aspect-square lg:aspect-auto'
                src={videoSorce} />
            </div>
            <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-4 sm:p-6 space-y-5'>
              <div className="flex justify-between items-center">
                <span className='text-sm text-gray-500'>
                  Interview Status
                </span>
                <span className={`text-xs sm:text-sm font-semibold px-3 py-1 rounded-full ${
                  isAIPlaying
                    ? "text-blue-600 bg-blue-50"
                    : "text-orange-600 bg-orange-50"
                }`}>
                  {isAIPlaying ? "AI Speaking" : "AI Listening"}
                </span>
              </div>
              <div className='h-px bg-gray-200'></div>
              <div className='flex justify-center py-2'>
                <Timer TotalTime={currentQuestion?.timeLimit || 60} timeLeft={timeLeft} />
              </div>
              <div className='h-px bg-gray-200'></div>
              <div className='grid grid-cols-2 gap-4 text-center pt-2'>
                <div className='flex flex-col items-center'>
                  <span className='text-2xl font-bold text-emerald-500'>{currentIndex + 1}</span>
                  <span className='text-gray-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mt-1'>Current Question</span>
                </div>
                <div className='flex flex-col items-center'>
                  <span className='text-2xl font-bold text-emerald-500'>{questions?.length}</span>
                  <span className='text-gray-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mt-1'>Total Question</span>
                </div>
              </div>
            </div>

          </div>

          {/* subtitle pending */}
          <div className="lg:w-[65%] w-full p-5 sm:p-8 lg:p-10 bg-white rounded-2xl shadow-inner flex flex-col justify-between min-h-[400px] border border-gray-200">
            <div>
              {/* Header */}
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-600 mb-4 sm:mb-6">AI Smart Interview</h2>

              {/* Question Box */}
              <div className="bg-gray-100 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border shadow-lg border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">Question {currentIndex + 1} of {questions?.length || 0}</span>
                </div>
                <h1 className="text-lg sm:text-xl md:text-xl font-bold text-gray-900 leading-snug">
                  {currentQuestion?.question || "Loading question..."}
                </h1>
              </div>

              {/* Answer Box */}
              <div className="w-full bg-gray-100 border border-gray-200 rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 shadow-xl transition-all">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={isAIPlaying || isSubmitting || isIntroPhase}
                  className="w-full h-32 md:h-48 lg:h-60 outline-none resize-none text-gray-700 bg-transparent placeholder-gray-400 text-base sm:text-lg"
                  placeholder={isAIPlaying ? "Please wait, AI is speaking..." : "Typing your answer..."}
                ></textarea>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 sm:gap-4 items-center">
              {/* Mic Button */}
              <button 
                onClick={toggleMic}
                disabled={isAIPlaying || isSubmitting || isIntroPhase}
                className={`flex items-center justify-center p-4 sm:p-5 rounded-full transition-all shadow-md shrink-0 hover:scale-105 ${
                  isMicOn ? 'bg-red-500 text-white animate-pulse' : 'bg-black text-white hover:bg-gray-800'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <FaMicrophone size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              {/* Submit Button */}
              <button 
                onClick={handleSubmit}
                disabled={isAIPlaying || isSubmitting || isIntroPhase}
                className={`w-full text-white py-3 sm:py-4 rounded-xl font-bold transition-all shadow-md text-base sm:text-lg hover:shadow-lg ${
                  isSubmitting || isAIPlaying || isIntroPhase ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isSubmitting ? "Submitting..." : (currentIndex === questions.length - 1 ? "Submit & Finish" : "Submit Answer")}
              </button>
            </div>
          </div>

        </div>



      </div>
    </div>
  )
}
