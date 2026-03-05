import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, User, Mail, Shield, Calendar, Save, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProfileSettingsPage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setMessage('Please fill in all required fields')
      return
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage('New passwords do not match')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      // Simulate API call (you would integrate with your auth API)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage('Profile updated successfully!')
      setIsEditing(false)
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error) {
      setMessage('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nova-dark via-nova-dark to-nova-darker px-4">
        <div className="text-center">
          <p className="text-nova-text-muted">Please log in to access profile settings.</p>
          <Link 
            to="/login"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-nova-teal text-white rounded-lg hover:bg-nova-teal/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nova-dark via-nova-dark to-nova-darker">
      {/* Header */}
      <div className="glass border-b border-nova-border">
        <div className="max-w-4xl md:max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="flex items-center gap-2 text-nova-text hover:text-nova-teal transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            
            <h1 className="text-xl font-semibold text-white">Profile Settings</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl md:max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
        <div className="glass rounded-xl border border-nova-border p-6 sm:p-8">
          {/* User Info Card */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-nova-teal/20 border border-nova-teal/30 flex items-center justify-center">
                <User className="w-8 h-8 text-nova-teal" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{user.fullName}</h2>
                <p className="text-nova-text-muted">{user.email}</p>
                <p className="text-nova-text-muted text-sm">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.includes('success') 
                ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                : 'bg-red-500/20 border-red-500/30 text-red-400'
            }`}>
              <p className="text-sm">{message}</p>
            </div>
          )}

          {/* Edit Form */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Account Information</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isEditing 
                    ? 'bg-gray-600 text-gray-300' 
                    : 'bg-nova-teal text-white hover:bg-nova-teal/80'
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            {isEditing && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-nova-text mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-nova-card border border-nova-border rounded-lg text-nova-text focus:outline-none focus:border-nova-teal/50"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-nova-text mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-nova-card border border-nova-border rounded-lg text-nova-text focus:outline-none focus:border-nova-teal/50"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Password Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-nova-text mb-3">Change Password (Optional)</h4>
                  
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-nova-text mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-nova-card border border-nova-border rounded-lg text-nova-text focus:outline-none focus:border-nova-teal/50"
                      placeholder="Enter current password"
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-nova-text mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-nova-card border border-nova-border rounded-lg text-nova-text focus:outline-none focus:border-nova-teal/50"
                      placeholder="Enter new password"
                    />
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-sm font-medium text-nova-text mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-nova-card border border-nova-border rounded-lg text-nova-text focus:outline-none focus:border-nova-teal/50"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-nova-teal text-white rounded-lg hover:bg-nova-teal/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-nova-teal border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Account Stats */}
            {!isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-nova-border">
                <div className="text-center">
                  <Shield className="w-8 h-8 text-nova-teal mx-auto mb-2" />
                  <h4 className="text-white font-semibold mb-1">Account Security</h4>
                  <p className="text-nova-text-muted text-sm">Two-factor authentication enabled</p>
                </div>
                <div className="text-center">
                  <Calendar className="w-8 h-8 text-nova-teal mx-auto mb-2" />
                  <h4 className="text-white font-semibold mb-1">Member Since</h4>
                  <p className="text-nova-text-muted text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-center">
                  <Mail className="w-8 h-8 text-nova-teal mx-auto mb-2" />
                  <h4 className="text-white font-semibold mb-1">Email Verified</h4>
                  <p className="text-nova-text-muted text-sm">{user.isEmailVerified ? 'Verified' : 'Not Verified'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
