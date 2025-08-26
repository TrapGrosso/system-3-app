import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft as ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LinkButton } from "@/components/shared/ui/LinkButton"

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const { resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await resetPassword(email)
      if (error) {
        // Show generic error to avoid account enumeration
        setError('Unable to request password reset. Please try again.')
      } else {
        setSubmitted(true)
      }
    } catch (err) {
      setError('Unable to request password reset. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Check your email</CardTitle>
              <CardDescription>
                If an account exists for this email, a password reset link has been sent.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Please check your email and click the link to reset your password. 
                The link will expire in 24 hours.
              </p>
            </CardContent>
            <CardFooter className="justify-center">
              <LinkButton to="/login" variant="outline">
                Back to login
              </LinkButton>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending reset link..." : "Send reset link"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <LinkButton 
              to="/login" 
              variant="ghost" 
              size="sm" 
              icon={<ArrowLeftIcon className="size-4" />}
            >
              Back to login
            </LinkButton>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
