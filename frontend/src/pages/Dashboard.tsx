
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Search, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  JournalEntry,
  getJournals,
  createJournal,
  updateJournal,
  deleteJournal,
  JournalQueryParams,
} from '@/api/journal.api';
import Layout from '@/components/layout/Layout';
import JournalCard from '@/components/journal/JournalCard';
import JournalDialog from '@/components/journal/JournalDialog';
import DeleteConfirmDialog from '@/components/journal/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useDebounce } from '@/hooks/useDebounce';

const Dashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // State for search, pagination and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  
  // Dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  
  // Queries
  const queryParams: JournalQueryParams = {
    page,
    limit,
    search: debouncedSearchTerm || undefined,
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['journals', queryParams],
    queryFn: () => getJournals(queryParams),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createJournal,
    onSuccess: () => {
      toast({
        title: "Journal Created",
        description: "Your journal entry has been created successfully.",
      });
      setCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['journals'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create journal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JournalEntry> }) => 
      updateJournal(id, data),
    onSuccess: () => {
      toast({
        title: "Journal Updated",
        description: "Your journal entry has been updated successfully.",
      });
      setEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['journals'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update journal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJournal,
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['journals'] });
      
      // Snapshot the previous value
      const previousJournals = queryClient.getQueryData(['journals', queryParams]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['journals', queryParams], (old: any) => {
        return {
          ...old,
          data: old.data.filter((journal: JournalEntry) => journal.id !== id),
        };
      });
      
      // Return a context object with the snapshotted value
      return { previousJournals };
    },
    onSuccess: () => {
      toast({
        title: "Journal Deleted",
        description: "Your journal entry has been deleted.",
      });
      setDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['journals'] });
    },
    onError: (error: Error, _, context) => {
      // If the mutation fails, roll back to the previous value
      queryClient.setQueryData(['journals', queryParams], context?.previousJournals);
      
      toast({
        title: "Failed to delete journal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Event handlers
  const handleCreate = (data: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedJournal) {
      updateMutation.mutate({
        id: selectedJournal.id,
        data,
      });
    }
  };

  const handleEditClick = (journal: JournalEntry) => {
    setSelectedJournal(journal);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (journal: JournalEntry) => {
    setSelectedJournal(journal);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedJournal) {
      deleteMutation.mutate(selectedJournal.id);
    }
  };

  // Render functions
  const renderJournalCards = () => {
    if (isLoading) {
      return Array(3).fill(0).map((_, index) => (
        <div key={index} className="col-span-1">
          <Skeleton className="h-[250px] w-full rounded-xl" />
        </div>
      ));
    }

    if (isError) {
      return (
        <div className="col-span-full text-center py-10">
          <p className="text-destructive">Error loading journals: {(error as Error).message}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['journals'] })}
          >
            Retry
          </Button>
        </div>
      );
    }

    if (data?.data.length === 0) {
      return (
        <div className="col-span-full text-center py-10">
          <p className="text-muted-foreground">No journal entries found.</p>
          <Button onClick={() => setCreateDialogOpen(true)} className="mt-4">
            Create your first journal
          </Button>
        </div>
      );
    }

    return data?.data.map((journal) => (
      <JournalCard
        key={journal.id}
        journal={journal}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
    ));
  };

  return (
    <Layout>
      <div className="container py-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}! Manage your journal entries here.
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Journal
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search journals..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSearchTerm('')}
              className="h-10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderJournalCards()}
        </div>

        {data && data.meta.pages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1} 
                />
              </PaginationItem>
              
              {Array.from({ length: data.meta.pages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink 
                    isActive={page === p}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setPage(p => Math.min(data.meta.pages, p + 1))}
                  disabled={page === data.meta.pages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Create Journal Dialog */}
      <JournalDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        title="Create New Journal Entry"
        description="Add a new journal entry to your collection."
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />

      {/* Edit Journal Dialog */}
      <JournalDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit Journal Entry"
        description="Update your journal entry details."
        initialData={selectedJournal || undefined}
        onSubmit={handleUpdate}
        isSubmitting={updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Journal Entry"
        description="Are you sure you want to delete this journal entry? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </Layout>
  );
};

export default Dashboard;
