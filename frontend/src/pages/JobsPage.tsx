import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Briefcase, MapPin, ExternalLink, Clock, DollarSign, Building, Search, Filter, RefreshCw } from 'lucide-react'
import { searchJobs } from '../services/api'

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string[]
  posted: string
  url?: string
  matchScore?: number
}

export default function JobsPage() {
  const { userProfile } = useApp()
  const [selectedLocation, setSelectedLocation] = useState('Remote')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJobType, setSelectedJobType] = useState('all')
  const [savedJobs, setSavedJobs] = useState<Job[]>([])
  const [appliedJobs, setAppliedJobs] = useState<string[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch jobs from backend
  const fetchJobs = async () => {
    setIsLoading(true)
    try {
      const targetRole = userProfile.targetRole || 'Software Engineer'
      const data = await searchJobs(targetRole, selectedLocation)

      const mappedJobs: Job[] = data.jobs.map((job: any, index: number) => ({
        id: `job-${index}-${Date.now()}`,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type || (job.location === 'Remote' || job.location === 'Global' ? 'Remote' : 'Full-time'),
        salary: job.salary || '$100k - $150k',
        description: job.description,
        requirements: job.required_skills || [],
        posted: job.posted || 'Recent',
        url: job.link,
        matchScore: job.skill_match ? Math.min(100, 70 + job.skill_match * 5) : 85
      }))

      setJobs(mappedJobs)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch and fetch on filter change
  useEffect(() => {
    fetchJobs()
  }, [selectedLocation, userProfile.targetRole])

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = selectedLocation === 'all' || job.location.includes(selectedLocation)
    const matchesType = selectedJobType === 'all' || job.type === selectedJobType

    return matchesSearch && matchesLocation && matchesType
  })

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'text-green-400 bg-green-500/20 border-green-500/30'
    if (score >= 70) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
    return 'text-red-400 bg-red-500/20 border-red-500/30'
  }

  const handleApplyNow = (job: Job) => {
    // Open job application URL in new tab
    if (job.url) {
      window.open(job.url, '_blank')
    } else {
      // Fallback to LinkedIn or company career page
      const searchQuery = encodeURIComponent(`${job.title} ${job.company}`)
      window.open(`https://www.linkedin.com/jobs/search/?keywords=${searchQuery}`, '_blank')
    }

    // Add to applied jobs
    setAppliedJobs(prev => [...prev, job.id])

    // Show success message
    alert(`Application started for ${job.title} at ${job.company}!`)
  }

  const handleSaveJob = (job: Job) => {
    // Add to saved jobs
    setSavedJobs(prev => {
      const exists = prev.find(savedJob => savedJob.id === job.id)
      if (exists) {
        // Remove if already saved
        return prev.filter(savedJob => savedJob.id !== job.id)
      } else {
        // Add to saved jobs
        return [...prev, job]
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Job Opportunities</h2>
        <p className="text-nova-text-muted">
          Discover positions that match your {userProfile.targetRole || 'career goals'}
        </p>

        {/* Search and Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-nova-text-muted" />
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-nova-card border border-nova-border rounded-lg text-nova-text focus:outline-none focus:border-nova-teal/50"
            />
          </div>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 bg-nova-card border border-nova-border rounded-lg text-nova-text focus:outline-none focus:border-nova-teal/50"
          >
            <option value="all">All Locations</option>
            <option value="Remote">Remote</option>
            <option value="Global">Worldwide</option>
            <option value="San Francisco">San Francisco</option>
            <option value="London">London</option>
            <option value="Berlin">Berlin</option>
            <option value="Singapore">Singapore</option>
            <option value="Nairobi">Nairobi</option>
          </select>

          <select
            value={selectedJobType}
            onChange={(e) => setSelectedJobType(e.target.value)}
            className="px-4 py-2 bg-nova-card border border-nova-border rounded-lg text-nova-text focus:outline-none focus:border-nova-teal/50"
          >
            <option value="all">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between">
          <p className="text-nova-text">
            Found <span className="text-nova-teal font-semibold">{filteredJobs.length}</span> global opportunities
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchJobs}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-nova-teal/10 text-nova-teal transition-colors disabled:opacity-50"
              title="Refresh jobs"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-nova-text-muted" />
              <span className="text-nova-text-muted text-sm">Target: {selectedLocation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="glass rounded-xl p-6 border border-nova-border/50 hover:border-nova-teal/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                  {job.matchScore && (
                    <span className={`px-2 py-1 text-xs rounded-full border ${getMatchColor(job.matchScore)}`}>
                      {job.matchScore}% Match
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-nova-text-muted text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{job.posted}</span>
                  </div>
                </div>

                <p className="text-nova-text mb-4">{job.description}</p>

                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, index) => (
                      <span key={index} className="px-3 py-1 bg-nova-teal/20 text-nova-teal text-xs rounded-full">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleApplyNow(job)}
                className="flex items-center gap-2 px-4 py-2 bg-nova-teal text-white rounded-lg hover:bg-nova-teal/80 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {appliedJobs.includes(job.id) ? 'Applied ✓' : 'Apply Now'}
              </button>
              <button
                onClick={() => handleSaveJob(job)}
                className="px-4 py-2 bg-nova-card border border-nova-border rounded-lg text-nova-text hover:border-nova-teal/50 transition-colors"
              >
                {savedJobs.find(savedJob => savedJob.id === job.id) ? 'Saved ✓' : 'Save Job'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredJobs.length === 0 && (
        <div className="glass rounded-xl p-8 text-center">
          <Briefcase className="w-16 h-16 text-nova-teal mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
          <p className="text-nova-text-muted mb-4">
            Try adjusting your search criteria or filters to find more opportunities.
          </p>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedLocation('all')
              setSelectedJobType('all')
            }}
            className="px-6 py-2 bg-nova-teal text-white rounded-lg hover:bg-nova-teal/80 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Saved Jobs Section */}
      {savedJobs.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Saved Jobs</h3>
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <div key={job.id} className="bg-nova-card/30 rounded-lg p-4 border border-nova-border/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-2">{job.title}</h4>
                    <div className="flex items-center gap-4 text-nova-text-muted text-sm mb-2">
                      <span>{job.company}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.salary}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveJob(job)}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job Search Tips */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Job Search Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-nova-teal/10 rounded-lg p-4 border border-nova-teal/30">
            <h4 className="text-nova-teal font-medium mb-2">🎯 Target Your Applications</h4>
            <p className="text-nova-text text-sm">
              Focus on jobs that match 70%+ of your skills for better success rates.
            </p>
          </div>
          <div className="bg-nova-teal/10 rounded-lg p-4 border border-nova-teal/30">
            <h4 className="text-nova-teal font-medium mb-2">📝 Customize Your Resume</h4>
            <p className="text-nova-text text-sm">
              Tailor your resume for each application to highlight relevant skills.
            </p>
          </div>
          <div className="bg-nova-teal/10 rounded-lg p-4 border border-nova-teal/30">
            <h4 className="text-nova-teal font-medium mb-2">🤝 Network Actively</h4>
            <p className="text-nova-text text-sm">
              Many jobs are filled through referrals. Connect with people in target companies.
            </p>
          </div>
          <div className="bg-nova-teal/10 rounded-lg p-4 border border-nova-teal/30">
            <h4 className="text-nova-teal font-medium mb-2">📈 Track Applications</h4>
            <p className="text-nova-text text-sm">
              Keep a spreadsheet of applications, interviews, and follow-ups.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
