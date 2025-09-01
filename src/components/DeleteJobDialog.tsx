'use client';

import { useState } from 'react';
import { JobApplication } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { ButtonSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';

interface DeleteJobDialogProps {
  job: JobApplication;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobDeleted: (jobId: string) => void;
}

export function DeleteJobDialog({ job, open, onOpenChange, onJobDeleted }: DeleteJobDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onJobDeleted(job.id);
        onOpenChange(false);
        toast.success('Job application deleted successfully');
      } else {
        toast.error('Failed to delete job application');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('An error occurred while deleting the job application');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Job Application
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Are you sure you want to delete this job application? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 rounded-lg border p-4 my-4">
          <div className="space-y-1">
            <p className="font-medium text-gray-900">{job.jobTitle}</p>
            <p className="text-sm text-gray-600">{job.companyName}</p>
            {job.location && (
              <p className="text-sm text-gray-500">{job.location}</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <ButtonSpinner />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
