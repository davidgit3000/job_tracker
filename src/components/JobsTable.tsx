'use client';

import { useState } from 'react';
import { JobApplication } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EditJobDialog } from '@/components/EditJobDialog';
import { ViewJobDialog } from '@/components/ViewJobDialog';
import { DeleteJobDialog } from '@/components/DeleteJobDialog';
import { Edit, Trash2, ExternalLink, Eye } from 'lucide-react';

interface JobsTableProps {
  jobs: JobApplication[];
  onJobUpdated: (job: JobApplication) => void;
  onJobDeleted: (jobId: string) => void;
}

export function JobsTable({ jobs, onJobUpdated, onJobDeleted }: JobsTableProps) {
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [viewingJob, setViewingJob] = useState<JobApplication | null>(null);
  const [deletingJob, setDeletingJob] = useState<JobApplication | null>(null);

  const handleDeleteClick = (job: JobApplication) => {
    setDeletingJob(job);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800';
      case 'Interview Scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'Interview Completed':
        return 'bg-purple-100 text-purple-800';
      case 'Offer Received':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No job applications yet</p>
        <p className="text-gray-400 text-sm mt-2">Click &quot;Add Job&quot; to get started</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-48">Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium w-64">
                  <div className="flex items-center space-x-2 max-w-56">
                    <span className="truncate">{job.jobTitle}</span>
                    {job.url && (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell>{job.companyName}</TableCell>
                <TableCell>
                  {job.location || '-'}
                </TableCell>
                <TableCell>
                  {job.dateApplied ? (() => {
                    // Convert to Date object and extract components to avoid timezone issues
                    const date = new Date(job.dateApplied);
                    // Use UTC methods to avoid timezone conversion
                    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                    const day = String(date.getUTCDate()).padStart(2, '0');
                    const year = date.getUTCFullYear();
                    return `${month}/${day}/${year}`;
                  })() : '-'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate">
                    {job.notes || '-'}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingJob(job)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingJob(job)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(job)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-3">
                  <div className="mb-1">
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">{job.jobTitle}</h3>
                  </div>
                  <p className="text-base text-gray-600 font-medium">{job.companyName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)} flex-shrink-0`}>
                  {job.status}
                </span>
              </div>
            </div>
            
            {/* Details */}
            <div className="space-y-3 mb-5">
              <div>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Location</span>
                <p className="text-sm text-gray-800 mt-1">{job.location || 'Not specified'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Date Applied</span>
                <p className="text-sm text-gray-800 mt-1">
                  {job.dateApplied ? (() => {
                    const date = new Date(job.dateApplied);
                    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                    const day = String(date.getUTCDate()).padStart(2, '0');
                    const year = date.getUTCFullYear();
                    return `${month}/${day}/${year}`;
                  })() : 'Not specified'}
                </p>
              </div>
              {job.notes && (
                <div>
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Notes</span>
                  <p className="text-sm text-gray-800 mt-1 leading-relaxed">{job.notes}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
              {job.url && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-blue-600 hover:text-blue-800 border-blue-200 hover:border-blue-300"
                >
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingJob(job)}
                className="text-blue-600 hover:text-blue-800 border-blue-200 hover:border-blue-300"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingJob(job)}
                className="hover:border-gray-300"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteClick(job)}
                className="text-red-600 hover:text-red-800 border-red-200 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editingJob && (
        <EditJobDialog
          job={editingJob}
          open={!!editingJob}
          onOpenChange={(open: boolean) => !open && setEditingJob(null)}
          onJobUpdated={onJobUpdated}
        />
      )}

      {viewingJob && (
        <ViewJobDialog
          job={viewingJob}
          open={!!viewingJob}
          onOpenChange={(open: boolean) => !open && setViewingJob(null)}
        />
      )}

      {deletingJob && (
        <DeleteJobDialog
          job={deletingJob}
          open={!!deletingJob}
          onOpenChange={(open: boolean) => !open && setDeletingJob(null)}
          onJobDeleted={onJobDeleted}
        />
      )}
    </>
  );
}
