import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Dashboard() {
    const { user, signOut } = useAuth()

    const handleLogout = async () => {
        await signOut()
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <Button onClick={handleLogout} variant="outline">
                        Logout
                    </Button>
                </div>
                
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome back!</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                You are successfully logged in as: <span className="font-medium">{user?.email}</span>
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Dashboard Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                This is your protected dashboard. Only authenticated users can see this content.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
