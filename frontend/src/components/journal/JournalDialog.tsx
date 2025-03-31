
import React from 'react';
import { JournalEntry } from '@/api/journal.api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import JournalForm from './JournalForm';

interface JournalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onSubmit: (data: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<JournalEntry>;
  isSubmitting: boolean;
}

const JournalDialog: React.FC<JournalDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  initialData,
  isSubmitting,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <JournalForm 
          initialData={initialData} 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default JournalDialog;
