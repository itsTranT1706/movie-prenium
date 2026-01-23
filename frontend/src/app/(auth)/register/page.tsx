'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks';

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { register, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const redirectTo = searchParams.get('redirect') || '/';

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, router, redirectTo]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setIsLoading(true);

        const result = await register(email, password, name);
        
        setIsLoading(false);

        if (result.success) {
            toast.success('Đăng ký thành công!');
            router.push(redirectTo);
        } else {
            toast.error(result.error || 'Đăng ký thất bại');
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(https://www.rophim.nl/images/home-background.jpg)',
                    }}
                />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Theater Spotlight Effect */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
                {/* Main spotlight from top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-white/10 via-white/5 to-transparent rounded-full blur-3xl animate-spotlight" />
                
                {/* Side spotlights */}
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-red-500/10 via-red-500/5 to-transparent rounded-full blur-2xl animate-spotlight-delay-1" />
                <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-purple-500/10 via-purple-500/5 to-transparent rounded-full blur-2xl animate-spotlight-delay-2" />
                
                {/* Theater curtain effect - top */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
                
                {/* Theater curtain effect - sides */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/60 to-transparent" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/60 to-transparent" />
                
                {/* Floating particles */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/40 rounded-full animate-float-1" />
                    <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white/30 rounded-full animate-float-2" />
                    <div className="absolute top-2/3 left-1/4 w-1 h-1 bg-white/20 rounded-full animate-float-3" />
                    <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/25 rounded-full animate-float-4" />
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex items-center justify-center px-4 py-8 min-h-screen">
                <div className="w-full max-w-[380px]">
                    {/* Form Card */}
                    <div className="bg-black/80 rounded-lg px-10 py-12 backdrop-blur-sm shadow-2xl shadow-black/50 animate-fade-in-up">
                        <h1 className="text-2xl font-semibold text-white mb-6">Sign Up</h1>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Email */}
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-3.5 bg-[#333] border border-[#555] rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:bg-[#454545] focus:border-gray-400 transition-colors disabled:opacity-50"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="w-full px-4 py-3.5 bg-[#333] border border-[#555] rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:bg-[#454545] focus:border-gray-400 transition-colors disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Name */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Name (optional)"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full px-4 py-3.5 bg-[#333] border border-[#555] rounded text-white text-sm placeholder-gray-500 focus:outline-none focus:bg-[#454545] focus:border-gray-400 transition-colors disabled:opacity-50"
                                />
                            </div>

                            {/* Password Requirements */}
                            <div className="text-xs text-gray-400 leading-relaxed pt-1">
                                Password must be at least 6 characters long.
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-[#e50914] hover:bg-[#f40612] text-white font-medium text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-5"
                            >
                                {isLoading ? 'Creating account...' : 'Sign Up'}
                            </button>

                            {/* OR Divider */}
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-2 bg-black/80 text-gray-400">OR</span>
                                </div>
                            </div>

                            {/* Google Sign-up Button */}
                            <button
                                type="button"
                                onClick={() => toast.info('Chức năng đang được phát triển')}
                                className="w-full py-3 bg-white hover:bg-gray-100 text-gray-800 font-medium text-sm rounded transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Sign up with Google
                            </button>

                            {/* Terms */}
                            <div className="text-xs text-gray-400 leading-relaxed pt-2">
                                By signing up, you agree to our{' '}
                                <Link href="/terms" className="text-gray-300 hover:underline">
                                    Terms of Use
                                </Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-gray-300 hover:underline">
                                    Privacy Policy
                                </Link>
                                .
                            </div>
                        </form>

                        {/* Sign In Link */}
                        <div className="mt-12 text-gray-400 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-white hover:underline font-medium">
                                Sign in
                            </Link>
                            .
                        </div>

                        {/* reCAPTCHA notice */}
                        <div className="mt-3 text-xs text-gray-500 leading-relaxed">
                            This page is protected by Google reCAPTCHA to ensure you&apos;re not a bot.{' '}
                            <button type="button" className="text-blue-500 hover:underline">
                                Learn more
                            </button>
                            .
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
