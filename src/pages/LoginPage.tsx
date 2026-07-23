import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AuthScreen } from '../screens/AuthScreen/AuthScreen'

export function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  return (
    <AuthScreen
      mode="login"
      loading={loading}
      {...(error !== undefined && { error })}
      onSubmit={(_credentials) => {
        setLoading(true)
        setError(undefined)
        // Simulate login delay then redirect
        setTimeout(() => {
          setLoading(false)
          navigate('/')
        }, 800)
      }}
    />
  )
}
