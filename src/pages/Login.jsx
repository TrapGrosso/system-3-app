import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from "@/components/forms/login-form"
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    
    const { signIn } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { error } = await signIn(email, password)
            if (error) {
                setError(error.message)
            } else {
                navigate('/dashboard')
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <LoginForm 
                    email={email}
                    password={password}
                    loading={loading}
                    error={error}
                    onSubmit={handleSubmit}
                    onEmailChange={handleEmailChange}
                    onPasswordChange={handlePasswordChange}
                />
            </div>
        </div>
    )
}
