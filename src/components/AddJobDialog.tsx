'use client';

import { useState } from 'react';
import { JobApplication } from '@prisma/client';
import { CreateJobApplication } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ButtonSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';

interface AddJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobAdded: (job: JobApplication) => void;
}

const statusOptions = [
  'Applied',
  'Interview Scheduled',
  'Interview Completed',
  'Offer Received',
  'Rejected',
  'Withdrawn'
];

export function AddJobDialog({ open, onOpenChange, onJobAdded }: AddJobDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateJobApplication>({
    job_title: '',
    company_name: '',
    url: '',
    location: '',
    date_applied: '',
    status: 'Applied',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newJob = await response.json();
        onJobAdded(newJob);
        toast.success(`Job application for ${formData.job_title} at ${formData.company_name} added successfully!`);
        setFormData({
          job_title: '',
          company_name: '',
          url: '',
          location: '',
          date_applied: '',
          status: 'Applied',
          notes: ''
        });
      } else {
        toast.error('Failed to add job application. Please try again.');
      }
    } catch (error) {
      console.error('Error adding job:', error);
      toast.error('An error occurred while adding the job application.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Job Application</DialogTitle>
          <DialogDescription>
            Fill in the details for your new job application.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job_title">Job Title *</Label>
            <Input
              id="job_title"
              value={formData.job_title}
              onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
              required
              placeholder="e.g. Software Engineer"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name *</Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              required
              placeholder="e.g. Google"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Job URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. San Francisco, CA"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_applied">Date Applied</Label>
            <Input
              id="date_applied"
              type="date"
              value={formData.date_applied}
              onChange={(e) => setFormData({ ...formData, date_applied: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
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
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
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
                  <span>Adding...</span>
                </div>
              ) : (
                'Add Job'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
