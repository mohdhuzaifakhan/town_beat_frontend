import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import api from '../api/client'

const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState('verifying')
    const navigate = useNavigate()
    const token = searchParams.get('token')

    useEffect(() => {
        if (token) {
            api.get(`/auth/verify?token=${token}`)
                .then(() => setStatus('success'))
                .catch(() => setStatus('error'))
        } else {
            setStatus('error')
        }
    }, [token])

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass max-w-md w-full p-10 rounded-[2.5rem] text-center space-y-6"
            >
                {status === 'verifying' && (
                    <>
                        <Loader2 className="animate-spin text-primary-400 mx-auto" size={48} />
                        <h2 className="text-2xl   font-medium">Verifying your email...</h2>
                        <p className="text-slate-400 font-medium">Please wait while we activate your account.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-400">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-medium text-white">Email Verified!</h2>
                        <p className="text-slate-400 font-medium">Your account is now active. You can now report news and participate in polls.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-primary-600 hover:bg-primary-500 text-white   font-medium py-3 rounded-lg transition-all shadow-lg shadow-primary-900/20"
                        >
                            Proceed to Login
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-400">
                            <XCircle size={40} />
                        </div>
                        <h2 className="text-2xl   font-medium text-white">Verification Failed</h2>
                        <p className="text-slate-400 font-medium">The link might be expired or invalid. Please try registering again.</p>
                        <button
                            onClick={() => navigate('/register')}
                            className="w-full bg-white/5 hover:bg-white/10 text-white   font-medium py-3 rounded-lg transition-all border border-white/10"
                        >
                            Back to Registration
                        </button>
                    </>
                )}
            </motion.div>
        </div>
    )
}

export default VerifyEmail
