import React, { useState } from 'react'
import Step1SetUp from '../components/Step1SetUp'
import Step2Interview from '../components/Step2Interview'
import Step3Report from '../components/Step3Report'

export default function InterviewPage() {
    const [step, setStep] = useState(1)
    const [interviewData, setInterViewData] = useState(null)
    return (
        <div>
            <div className='min-h-screen bg-gray-50'>
                {step === 1 && (
                    <Step1SetUp onStart={(data)=>{setInterViewData(data)
                        setStep(2)}
                    } />
                )}
                {step === 2 && (
                    <Step2Interview interviewData={interviewData}
                    onFinish={(report)=>{setInterViewData(report);
                        setStep(3)
                    }}
                    />
                )}
                {step === 3 && (
                    <Step3Report
                    report={interviewData} 
                    />
                )}
            </div>
        </div>
    )
}
