import { prisma } from '../lib/prisma.js';
import fetch from 'node-fetch';
import 'dotenv/config';

export class AIService {
  static async analyzeMood(content: string): Promise<string> {
    try {
      const apiKey = process.env.CLAUDE_KEY;
      
      if (!apiKey) {
        console.warn("Claude API key not found. Using fallback mood detection.");
        return this.fallbackMoodAnalysis(content);
      }
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 50,
          messages: [
            {
              role: "user",
              content: `Analyze the following journal entry and determine the primary mood (happy, sad, anxious, neutral, angry). Only return one word with the mood.\n\nJournal entry: "${content}"`
            }
          ],
          temperature: 0.2
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Claude API error:", errorData);
        return this.fallbackMoodAnalysis(content);
      }
      
      const data = await response.json();
      
      // Extract the mood from Claude's response
      const moodResponse = data.content[0].text.trim().toLowerCase();
      
      // Normalize to our standard mood categories
      if (moodResponse.includes('happy') || moodResponse.includes('joy')) {
        return 'happy';
      } else if (moodResponse.includes('sad') || moodResponse.includes('depress')) {
        return 'sad';
      } else if (moodResponse.includes('anx') || moodResponse.includes('worry') || moodResponse.includes('stress')) {
        return 'anxious';
      } else if (moodResponse.includes('ang') || moodResponse.includes('frustrat') || moodResponse.includes('irritat')) {
        return 'angry';
      } else {
        return 'neutral';
      }
    } catch (error) {
      console.error("Error analyzing mood:", error);
      return this.fallbackMoodAnalysis(content);
    }
  }

  private static fallbackMoodAnalysis(content: string): string {
    // Simple keyword-based sentiment analysis
    const keywords = {
      happy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'enjoyed', 'delighted'],
      sad: ['sad', 'depressed', 'unhappy', 'miserable', 'disappointed', 'upset', 'crying', 'lonely'],
      anxious: ['anxious', 'worried', 'nervous', 'stress', 'fear', 'panic', 'concern', 'tension'],
      angry: ['angry', 'annoyed', 'frustrated', 'irritated', 'mad', 'furious', 'rage', 'hate'],
      neutral: ['normal', 'fine', 'ok', 'okay', 'average', 'so-so']
    };
    
    // Count occurrences of mood-related keywords
    const moodCounts: Record<string, number> = { happy: 0, sad: 0, anxious: 0, angry: 0, neutral: 0 };
    const contentLower = content.toLowerCase();
    
    for (const [mood, words] of Object.entries(keywords)) {
      for (const word of words) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = contentLower.match(regex);
        if (matches) {
          moodCounts[mood] += matches.length;
        }
      }
    }
    
    // Find the mood with highest count
    let dominantMood = 'neutral';
    let highestCount = 0;
    
    for (const [mood, count] of Object.entries(moodCounts)) {
      if (count > highestCount) {
        highestCount = count;
        dominantMood = mood;
      }
    }
    
    return dominantMood;
  }

  static async generateTags(content: string): Promise<string[]> {
    try {
      const apiKey = process.env.CLAUDE_KEY;
      
      if (!apiKey) {
        console.warn("Claude API key not found. Using fallback tag generation.");
        return this.fallbackTagGeneration(content);
      }
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 100,
          messages: [
            {
              role: "user",
              content: `Extract 1-5 meaningful tags from this journal entry. Only return the tags as a comma-separated list, with no other text. Common categories include: work, health, family, personal, goals, travel, learning, etc.\n\nJournal entry: "${content}"`
            }
          ],
          temperature: 0.2
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Claude API error:", data);
        return this.fallbackTagGeneration(content);
      }
      
      // Extract tags from Claude's response and clean them
      const tagsText = data.content[0].text.trim();
      const tags = tagsText.split(',')
        .map((tag: string) => tag.trim().toLowerCase())
        .filter((tag: string) => tag.length > 0);
      
      return tags;
    } catch (error) {
      console.error("Error generating tags:", error);
      return this.fallbackTagGeneration(content);
    }
  }

  private static fallbackTagGeneration(content: string): string[] {
    const commonTags = ['work', 'health', 'family', 'personal', 'goals', 'travel', 'learning'];
    const contentLower = content.toLowerCase();
    
    // Check for presence of common themes
    return commonTags.filter(tag => contentLower.includes(tag)).slice(0, 3);
  }

  static async generateInsights(userId: string): Promise<any> {
    try {
      // Get user's journals
      const journals = await prisma.journal.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20, // Analyze the most recent 20 entries
      });
      
      if (journals.length === 0) {
        return {
          summary: "You haven't written any journal entries yet. Start journaling to receive AI insights.",
          topTopics: [],
          suggestions: [
            "Try to write regularly to build a journaling habit.",
            "Include details about your feelings and thoughts in your entries."
          ],
          moodTrend: "No mood data available yet."
        };
      }
      
      // Collect mood data
      const moodCounts: Record<string, number> = {};
      journals.forEach((journal) => {
        if (journal.mood) {
          moodCounts[journal.mood] = (moodCounts[journal.mood] || 0) + 1;
        }
      });
      
      // Determine dominant mood
      let dominantMood = 'neutral';
      let highestCount = 0;
      
      for (const [mood, count] of Object.entries(moodCounts)) {
        if (count > highestCount) {
          highestCount = count;
          dominantMood = mood;
        }
      }
      
      // Collect topics/tags
      const topicCounts: Record<string, number> = {};
      journals.forEach((journal) => {
        if (journal.tags && Array.isArray(journal.tags)) {
          journal.tags.forEach((tag: string) => {
            topicCounts[tag] = (topicCounts[tag] || 0) + 1;
          });
        }
        
        if (journal.category) {
          topicCounts[journal.category] = (topicCounts[journal.category] || 0) + 1;
        }
      });
      
      // Sort topics by count
      const topTopics = Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);
      
      // Generate insights
      return {
        summary: `You've written ${journals.length} entries recently, and your mood has been predominantly ${dominantMood}.`,
        topTopics,
        suggestions: [
          "Try to explore more about how your activities affect your mood.",
          "Consider journaling at different times of day to capture various perspectives."
        ],
        moodTrend: this.getMoodTrendText(journals),
      };
    } catch (error) {
      console.error("Error generating insights:", error);
      return {
        summary: "Could not generate insights at this time.",
        topTopics: [],
        suggestions: ["Try again later."],
        moodTrend: "Data unavailable.",
      };
    }
  }
  
  private static getMoodTrendText(journals: any[]): string {
    if (journals.length < 5) {
      return "Need more entries to establish a mood trend.";
    }
    
    // Simple algorithm to detect mood trends
    const moodValues: Record<string, number> = {
      'happy': 2,
      'neutral': 0,
      'sad': -1,
      'anxious': -1,
      'angry': -2
    };
    
    const recentMoods = journals.slice(0, 5).map(j => j.mood || 'neutral');
    const earlierMoods = journals.slice(-5).map(j => j.mood || 'neutral');
    
    const recentAvg = recentMoods.reduce((sum, mood) => sum + (moodValues[mood as keyof typeof moodValues] || 0), 0) / recentMoods.length;
    const earlierAvg = earlierMoods.reduce((sum, mood) => sum + (moodValues[mood as keyof typeof moodValues] || 0), 0) / earlierMoods.length;
    
    if (recentAvg > earlierAvg + 0.5) {
      return "Your mood has been improving recently.";
    } else if (recentAvg < earlierAvg - 0.5) {
      return "Your mood has declined somewhat recently.";
    } else {
      return "Your mood has been relatively stable lately.";
    }
  }
}
