import { useState, useEffect } from 'react';
import { Bot, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import VerificationForm from '../components/auth/VerificationForm';

export default function VerificationPage() {
    const [error, setError] = useState<string | null>(null);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();
    const { user, verify, isLoading } = useAuth();

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else {
            setResendDisabled(false);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleResendOTP = async () => {
        setError(null);
        setResendDisabled(true);
        setCountdown(30);
        const result = await verify(user?.email as string, null);
        if (!result.success) {
            setError(result.error?.message);
            setResendDisabled(false);
            setCountdown(0);
        }
    };

    const handleVerification = async (code: string) => {
        setError(null);
        const result = await verify(user?.email as string, code);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error?.message)
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white flex flex-col">
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8 p-8">
                    <div className="flex flex-col max-w-2xl mx-auto flex items-center space-x-3">
                        <div className="flex justify-center mb-4">
                            <Bot className="w-16 h-16 text-gray-900 bg-gradient-to-r from-pink-200 to-blue-400 p-3 rounded-full" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">

                        </span>
                    </div>
                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-semibold">Almost There</h1>
                        <p className="text-gray-400">
                            A verification code has been sent to <span className="text-blue-400">{user?.email || <span className='text-gray-400'>your email</span>}</span>
                        </p>
                        <p className="text-gray-400">
                            Can't find the email? Check your spam or junk mail folder.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 text-red-500 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <label className="block text-sm text-gray-400 text-center">
                                Enter the 6-digit verification code
                            </label>
                            <VerificationForm
                                length={6}
                                onComplete={handleVerification}
                                disabled={isLoading}
                            />
                        </div>

                        {isLoading && (
                            <div className="flex items-center justify-center space-x-2 text-blue-400">
                                <Loader className="w-5 h-5 animate-spin" />
                                <span>Please wait...</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-8 text-center">
                        <p className="text-sm text-gray-400">
                            Didn't receive the code?{' '}
                            <button
                                onClick={handleResendOTP}
                                disabled={resendDisabled || isLoading}
                                className="text-sm text-blue-500 hover:underline disabled:text-gray-500 disabled:no-underline">
                                Resend Code {countdown > 0 && `(${countdown}s)`}
                            </button>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}