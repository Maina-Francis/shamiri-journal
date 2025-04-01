import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Search, Trash2, BookOpen, Star, BarChart3, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  JournalEntry,
  getJournals,
  createJournal,
  updateJournal,
  deleteJournal,
  toggleJournalFavorite,
  getJournalStats,
  JournalQueryParams,
} from '@/api/journal.api';
import Layout from '@/components/layout/Layout';
import JournalCard from '@/components/journal/JournalCard';
import JournalDialog from '@/components/journal/JournalDialog';
import DeleteConfirmDialog from '@/components/journal/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import StatCard from '@/components/dashboard/StatCard';
import FavoritesList from '@/components/dashboard/FavoritesList';
import { BarChart } from '@/components/ui/charts';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useDebounce } from '@/hooks/useDebounce';

const Dashboard = () => {
  const auth = useAuth();
  const queryClient = useQueryClient();
  
  // State for search, pagination and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [activeTab, setActiveTab] = useState('all');
  
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
    ...(activeTab === 'favorites' ? { favorite: true } : {}),
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['journals', queryParams],
    queryFn: () => getJournals(queryParams),
  });

  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['journal-stats'],
    queryFn: () => getJournalStats(),
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
      queryClient.invalidateQueries({ queryKey: ['journal-stats'] });
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
      queryClient.invalidateQueries({ queryKey: ['journal-stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update journal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) => 
      toggleJournalFavorite(id, isFavorite),
    onSuccess: (data) => {
      toast({
        title: data.isFavorite ? "Added to Favorites" : "Removed from Favorites",
        description: data.isFavorite 
          ? "Journal entry added to your favorites." 
          : "Journal entry removed from your favorites.",
      });
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['journal-stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update favorite status",
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
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['journal-stats'] });
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
  const handleCreate = (data: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite' | 'tags' | 'aiInsights'>) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite' | 'tags' | 'aiInsights'>) => {
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

  const handleFavoriteClick = (journal: JournalEntry, isFavorite: boolean) => {
    console.log('handleFavoriteClick called with:', journal.id, isFavorite);
    // Ensure isFavorite is a proper boolean
    const boolValue = isFavorite === true;
    
    favoriteMutation.mutate({
      id: journal.id,
      isFavorite: boolValue,
    });
  };

  const handleConfirmDelete = () => {
    if (selectedJournal) {
      deleteMutation.mutate(selectedJournal.id);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1); // Reset page when changing tabs
  };

  // Format activity data for chart
  const activityData = statsData?.recentActivity 
    ? statsData.recentActivity.map((item: any) => ({
        date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
        entries: Number(item.count),
      })).slice(0, 7).reverse() // Ensure we only show up to 7 days of data, in chronological order
    : [];

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
        onFavorite={handleFavoriteClick}
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
              Welcome back, {auth.user?.name || 'User'}! Here's an overview of your journaling activity.
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Journal
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Entries" 
            value={isLoadingStats ? "..." : statsData?.totalEntries || 0}
            description="All your journal entries"
            icon={<BookOpen />}
          />
          <StatCard 
            title="Favorite Entries" 
            value={isLoadingStats ? "..." : statsData?.favoriteEntries || 0}
            description="Your bookmarked journals"
            icon={<Star />}
          />
          <StatCard 
            title="Weekly Average" 
            value={isLoadingStats && !activityData.length ? "..." : 
              activityData.length ? 
                (activityData.reduce((sum, day) => sum + day.entries, 0) / activityData.length).toFixed(1) :
                "0"
            }
            description="Entries per day"
            icon={<CalendarIcon />}
          />
          <StatCard 
            title="Most Common Mood" 
            value={isLoadingStats ? "..." : 
              statsData?.moods && statsData.moods.length > 0 ? 
                statsData.moods.sort((a, b) => b.count - a.count)[0].name : 
                "None"
            }
            description="Based on your entries"
            icon={<BarChart3 />}
          />
        </div>

        {/* Activity chart and Favorites */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                {isLoadingStats ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : activityData.length > 0 ? (
                  <div className="h-[200px] overflow-hidden">
                    <BarChart 
                      data={activityData}
                      index="date"
                      categories={['entries']}
                      colors={['blue']}
                      valueFormatter={(value) => `${value} entries`}
                      className="w-full h-full"
                      yAxisWidth={30}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[200px] bg-muted/20 rounded-md">
                    <p className="text-muted-foreground text-sm">No recent activity data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <FavoritesList />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Entries</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>
                <div className="relative w-full max-w-sm ml-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search journals..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-1 top-1 h-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {renderJournalCards()}
                </div>
              </TabsContent>
              
              <TabsContent value="favorites" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {renderJournalCards()}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {data && data.meta.pages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => page > 1 && setPage(p => p - 1)}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
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
                    onClick={() => page < data.meta.pages && setPage(p => p + 1)}
                    className={page === data.meta.pages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
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
