
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';
import AnimatedContainer from '../ui/AnimatedContainer';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDebounce } from '@/hooks/useDebounce';

interface EditorProps {
  date?: Date;
  initialContent?: string;
  onSave?: (content: string) => void;
}

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'list': 'bullet' }],
    ['clean']
  ],
};

const formats = [
  'bold', 'italic', 'underline', 'list', 'bullet'
];

const Editor = ({ date = new Date(), initialContent = '', onSave }: EditorProps) => {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  
  const debouncedContent = useDebounce(content, 1500);
  
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    if (debouncedContent && debouncedContent !== initialContent) {
      handleAutoSave();
    }
  }, [debouncedContent]);

  useEffect(() => {
    // Calculate word count - strip HTML and count words
    const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text ? text.split(' ').length : 0;
    setWordCount(words);
  }, [content]);

  const handleSave = () => {
    if (!content.trim()) return;
    
    setIsSaving(true);
    
    // Save logic
    setTimeout(() => {
      if (onSave) onSave(content);
      setLastSaved(new Date());
      setIsSaving(false);
    }, 600);
  };

  const handleAutoSave = () => {
    if (!content.trim()) return;
    
    setIsSaving(true);
    
    // Autosave with short delay to simulate API call
    setTimeout(() => {
      if (onSave) onSave(content);
      setLastSaved(new Date());
      setIsSaving(false);
    }, 300);
  };

  return (
    <AnimatedContainer 
      className="glass-card p-6 max-w-3xl w-full mx-auto shadow-md hover:shadow-lg transition-shadow border border-purple-100 dark:border-purple-900/40 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950/30" 
      animation="slide-up"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs uppercase tracking-wide text-purple-500 dark:text-purple-400 font-semibold">
            {format(date, 'EEEE')}
          </span>
          <h2 className="text-2xl font-medium bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">{format(date, 'MMMM d, yyyy')}</h2>
        </div>
      </div>
      
      <Separator className="my-4 bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-800/30 dark:to-blue-800/30" />
      
      <div className="min-h-[300px]">
        <ReactQuill 
          theme="snow" 
          value={content} 
          onChange={setContent}
          modules={modules}
          formats={formats}
          placeholder="What's on your mind today?"
          className="h-[250px] mb-12 bg-white/80 dark:bg-gray-900/80 rounded-md"
        />
      </div>
      
      <div className="flex items-center justify-between mt-6 pt-2 border-t border-purple-100 dark:border-purple-800/30">
        <div className="text-xs text-muted-foreground">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
          {lastSaved && (
            <span className="ml-3">
              Last saved: {format(lastSaved, 'h:mm a')}
            </span>
          )}
        </div>
        
        <Button
          onClick={handleSave}
          disabled={isSaving || !content.trim()}
          className="flex items-center gap-2 transition-all bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
          size="sm"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </AnimatedContainer>
  );
};

export default Editor;
