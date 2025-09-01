'use client';

import { useState } from 'react';
import { JobApplication } from '@prisma/client';
import { UpdateJobApplication } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ButtonSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';

interface EditJobDialogProps {
  job: JobApplication;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobUpdated: (job: JobApplication) => void;
}

const statusOptions = [
  'Applied',
  'Interview Scheduled',
  'Interview Completed',
  'Offer Received',
  'Rejected',
  'Withdrawn'
];

export function EditJobDialog({ job, open, onOpenChange, onJobUpdated }: EditJobDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateJobApplication>({
    id: job.id,
    job_title: job.jobTitle,
    company_name: job.companyName,
    url: job.url || '',
    location: job.location || '',
    date_applied: job.dateApplied ? new Date(job.dateApplied).toISOString().split('T')[0] : '',
    status: job.status as 'Applied' | 'Interview Scheduled' | 'Interview Completed' | 'Offer Received' | 'Rejected' | 'Withdrawn',
    notes: job.notes || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedJob = await response.json();
        onJobUpdated(updatedJob);
        toast.success(`Job application for ${formData.job_title} at ${formData.company_name} updated successfully!`);
        onOpenChange(false);
      } else {
        toast.error('Failed to update job application. Please try again.');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('An error occurred while updating the job application.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job Application</DialogTitle>
          <DialogDescription>
            Update the details for this job application.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit_job_title">Job Title *</Label>
            <Input
              id="edit_job_title"
              value={formData.job_title}
              onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit_company_name">Company Name *</Label>
            <Input
              id="edit_company_name"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_url">Job URL</Label>
            <Input
              id="edit_url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_location">Location</Label>
            <Input
              id="edit_location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_date_applied">Date Applied</Label>
            <Input
              id="edit_date_applied"
              type="date"
              value={formData.date_applied}
              onChange={(e) => setFormData({ ...formData, date_applied: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as 'Applied' | 'Interview Scheduled' | 'Interview Completed' | 'Offer Received' | 'Rejected' | 'Withdrawn' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_notes">Notes</Label>
            <Textarea
              id="edit_notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <ButtonSpinner size="sm" />
                  <span>Updating...</span>
                </div>
              ) : (
                'Update Job'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
