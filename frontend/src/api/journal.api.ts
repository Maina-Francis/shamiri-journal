import { API_URL } from '@/config/constants';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category?: string;
  isFavorite: boolean;
  mood?: string;
  tags?: string[];
  aiInsights?: any;
  createdAt: string;
  updatedAt: string;
}

export interface JournalQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  favorite?: boolean;
  mood?: string;
  tags?: string[];
}

export interface JournalResponse {
  data: JournalEntry[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface JournalStats {
  totalEntries: number;
  favoriteEntries: number;
  categories: { name: string; count: number }[];
  moods: { name: string; count: number }[];
  recentActivity: { date: string; count: number }[];
  insights?: {
    summary: string;
    topTopics: string[];
    suggestions: string[];
    moodTrend: string;
  };
}

// Create a new journal entry
export const createJournal = async (data: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'isFavorite' | 'tags' | 'aiInsights' | 'userId'>): Promise<JournalEntry> => {
  const response = await fetch(`${API_URL}/journals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create journal entry');
  }

  return response.json();
};

// Get all journal entries with pagination and filtering
export const getJournals = async (params: JournalQueryParams = {}): Promise<JournalResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.category) queryParams.append('category', params.category);
  if (params.search) queryParams.append('search', params.search);
  if (params.favorite !== undefined) queryParams.append('favorite', params.favorite.toString());
  if (params.mood) queryParams.append('mood', params.mood);
  if (params.tags && params.tags.length > 0) queryParams.append('tags', params.tags.join(','));
  
  const url = `${API_URL}/journals?${queryParams.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch journal entries');
  }

  return response.json();
};

// Get journal statistics
export const getJournalStats = async (): Promise<JournalStats> => {
  const response = await fetch(`${API_URL}/journals/stats`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch journal statistics');
  }

  return response.json();
};

// Get a single journal entry by ID
export const getJournalById = async (id: string): Promise<JournalEntry> => {
  const response = await fetch(`${API_URL}/journals/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch journal entry');
  }

  return response.json();
};

// Update a journal entry
export const updateJournal = async (id: string, data: Partial<JournalEntry>): Promise<JournalEntry> => {
  const response = await fetch(`${API_URL}/journals/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update journal entry');
  }

  return response.json();
};

// Toggle favorite status
export const toggleJournalFavorite = async (id: string, isFavorite: boolean): Promise<JournalEntry> => {
  console.log('Toggling favorite with value:', isFavorite, 'Type:', typeof isFavorite);
  
  // Make sure it's a proper boolean
  const boolValue = isFavorite === true;
  
  const response = await fetch(`${API_URL}/journals/${id}/favorite`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ isFavorite: boolValue })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update favorite status');
  }

  return response.json();
};

// Delete a journal entry
export const deleteJournal = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/journals/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete journal entry');
  }
};

// Get all journal entries (without pagination) for insights page
export const getAllJournalEntries = async (): Promise<JournalEntry[]> => {
  const response = await fetch(`${API_URL}/journals/all`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    const allJournals = await getJournals({ limit: 100 });
    return allJournals.data;
  }

  return response.json();
};
