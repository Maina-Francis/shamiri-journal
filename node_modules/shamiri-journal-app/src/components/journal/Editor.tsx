
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';
import AnimatedContainer from '../ui/AnimatedContainer';

interface EditorProps {
  date?: Date;
  initialContent?: string;
  onSave?: (content: string) => void;
}

const Editor = ({ date = new Date(), initialContent = '', onSave }: EditorProps) => {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = () => {
    if (!content.trim()) return;
    
    setIsSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      if (onSave) onSave(content);
      setLastSaved(new Date());
      setIsSaving(false);
    }, 600);
  };

  return (
    <AnimatedContainer 
      className="glass-card p-6 max-w-3xl w-full mx-auto" 
      animation="slide-up"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {format(date, 'EEEE')}
          </span>
          <h2 className="text-2xl font-medium">{format(date, 'MMMM d, yyyy')}</h2>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving || !content.trim()}
          className="flex items-center gap-2 transition-all"
          size="sm"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
      
      <Separator className="my-4" />
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind today?"
        className="w-full min-h-[300px] p-3 bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-base"
        autoFocus
      />
      
      {lastSaved && (
        <div className="text-xs text-muted-foreground mt-4 text-right">
          Last saved {format(lastSaved, 'h:mm a')}
        </div>
      )}
    </AnimatedContainer>
  );
};

export default Editor;
