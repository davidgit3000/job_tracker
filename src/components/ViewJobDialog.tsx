'use client';

import { JobApplication } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, MapPin, Building, FileText, Clock } from 'lucide-react';

interface ViewJobDialogProps {
  job: JobApplication;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewJobDialog({ job, open, onOpenChange }: ViewJobDialogProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Interview Scheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Interview Completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Offer Received':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Withdrawn':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Job Application Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Job Title and Company */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {job.jobTitle}
                </h3>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  {job.companyName}
                </p>
              </div>
              <div className="flex items-center gap-3">
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
                <Badge className={`${getStatusColor(job.status)} font-medium`}>
                  {job.status}
                </Badge>
              </div>
            </div>

          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Location and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {job.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{job.location}</span>
              </div>
            )}

            {job.dateApplied && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">
                  Applied on {(() => {
                    const date = new Date(job.dateApplied);
                    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                    const day = String(date.getUTCDate()).padStart(2, '0');
                    const year = date.getUTCFullYear();
                    return `${month}/${day}/${year}`;
                  })()}
                </span>
              </div>
            )}
          </div>

          {/* Notes */}
          {job.notes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <h4 className="font-medium text-gray-900">Notes</h4>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{job.notes}</p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>
                Created: {new Date(job.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>
                Last updated: {new Date(job.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
