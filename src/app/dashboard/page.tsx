'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { JobApplication } from '@prisma/client';
import { JobsTable } from '@/components/JobsTable';
import { AddJobDialog } from '@/components/AddJobDialog';
import { Button } from '@/components/ui/button';
import { LogOut, Plus, Search, Filter, ChevronDown, X } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchJobs();
    }
  }, [session]);

  // Apply filters whenever jobs, searchQuery, statusFilter, or dateFilter change
  useEffect(() => {
    applyFilters(searchQuery, statusFilter, dateFilter);
  }, [jobs, searchQuery, statusFilter, dateFilter]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
        setFilteredJobs(data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobAdded = (newJob: JobApplication) => {
    const updatedJobs = [newJob, ...jobs];
    setJobs(updatedJobs);
    setFilteredJobs(updatedJobs);
    setIsAddDialogOpen(false);
  };

  const handleJobUpdated = (updatedJob: JobApplication) => {
    const updatedJobs = jobs.map(job => job.id === updatedJob.id ? updatedJob : job);
    setJobs(updatedJobs);
  };

  const handleJobDeleted = (deletedJobId: string) => {
    const updatedJobs = jobs.filter(job => job.id !== deletedJobId);
    setJobs(updatedJobs);
  };

  const applyFilters = (searchQuery: string, statusFilter: string, dateFilter: string) => {
    let filtered = jobs;

    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(job => 
        job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== '') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== '') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(job => {
            if (!job.dateApplied) return false;
            const jobDate = new Date(job.dateApplied);
            jobDate.setHours(0, 0, 0, 0);
            return jobDate.getTime() === filterDate.getTime();
          });
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(job => {
            if (!job.dateApplied) return false;
            return new Date(job.dateApplied) >= filterDate;
          });
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(job => {
            if (!job.dateApplied) return false;
            return new Date(job.dateApplied) >= filterDate;
          });
          break;
        case '3months':
          filterDate.setMonth(now.getMonth() - 3);
          filtered = filtered.filter(job => {
            if (!job.dateApplied) return false;
            return new Date(job.dateApplied) >= filterDate;
          });
          break;
      }
    }

    setFilteredJobs(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, statusFilter, dateFilter);
  };

  const handleStatusFilter = (status: string) => {
    const newStatus = status === statusFilter ? '' : status;
    setStatusFilter(newStatus);
    applyFilters(searchQuery, newStatus, dateFilter);
  };

  const handleDateFilter = (date: string) => {
    const newDate = date === dateFilter ? '' : date;
    setDateFilter(newDate);
    applyFilters(searchQuery, statusFilter, newDate);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setDateFilter('');
    setFilteredJobs(jobs);
  };

  const getDateFilterLabel = (filter: string) => {
    switch (filter) {
      case 'today': return 'Today';
      case 'week': return 'Last 7 days';
      case 'month': return 'Last 30 days';
      case '3months': return 'Last 3 months';
      default: return 'All time';
    }
  };

  const statusOptions = ['Applied', 'Interview Scheduled', 'Interview Completed', 'Offer Received', 'Rejected', 'Withdrawn'];
  const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 days' },
    { value: 'month', label: 'Last 30 days' },
    { value: '3months', label: 'Last 3 months' }
  ];

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner 
          size="lg" 
          text="Loading your job applications..." 
          variant="default"
        />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">Job Tracker</h1>
              <p className="text-sm text-gray-600">Welcome, {session.user?.name}!</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Job</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-medium text-gray-900">
                Job Applications ({filteredJobs.length})
              </h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1 sm:flex-none sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs, companies, or status..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {/* Status Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {statusFilter || 'Status'}
                        </span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusFilter('')}>
                        All Statuses
                      </DropdownMenuItem>
                      {statusOptions.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => handleStatusFilter(status)}
                          className={statusFilter === status ? 'bg-blue-50' : ''}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Date Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <span className="hidden sm:inline">
                          {getDateFilterLabel(dateFilter)}
                        </span>
                        <span className="sm:hidden">Date</span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDateFilter('')}>
                        All time
                      </DropdownMenuItem>
                      {dateOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => handleDateFilter(option.value)}
                          className={dateFilter === option.value ? 'bg-blue-50' : ''}
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Clear Filters */}
                  {(searchQuery || statusFilter || dateFilter) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                      <span className="hidden sm:inline">Clear</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Active Filters Display */}
            {(statusFilter || dateFilter) && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">Active filters:</span>
                {statusFilter && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Status: {statusFilter}
                    <button 
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                      onClick={() => handleStatusFilter('')}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {dateFilter && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Date: {getDateFilterLabel(dateFilter)}
                    <button 
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                      onClick={() => handleDateFilter('')}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
          <JobsTable
            jobs={filteredJobs}
            onJobUpdated={handleJobUpdated}
            onJobDeleted={handleJobDeleted}
          />
        </div>
      </main>

      <AddJobDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onJobAdded={handleJobAdded}
      />
    </div>
  );
}
