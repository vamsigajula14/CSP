import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, User, Plus, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Discussion, Profile, Vote } from '../lib/supabase';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

function Community() {
  const [discussions, setDiscussions] = useState<(Discussion & { author: Profile, votes: number, hasVoted: boolean })[]>([]);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  useEffect(() => {
    fetchDiscussions();
  }, [user]);

  async function fetchDiscussions() {
    try {
      const { data: discussionsData, error: discussionsError } = await supabase
        .from('discussions')
        .select(`
          *,
          author:profiles(*)
        `)
        .order('created_at', { ascending: false });

      if (discussionsError) throw discussionsError;

      // Fetch votes for each discussion
      const discussionsWithVotes = await Promise.all(
        discussionsData.map(async (discussion) => {
          const { data: votesData } = await supabase
            .from('votes')
            .select('*')
            .eq('discussion_id', discussion.id);

          const hasVoted = votesData?.some(vote => vote.user_id === user?.id) ?? false;

          return {
            ...discussion,
            author: discussion.author,
            votes: votesData?.length ?? 0,
            hasVoted
          };
        })
      );

      setDiscussions(discussionsWithVotes);
    } catch (error) {
      toast.error('Error fetching discussions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleVote(discussionId: string, hasVoted: boolean) {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    try {
      if (hasVoted) {
        await supabase
          .from('votes')
          .delete()
          .eq('discussion_id', discussionId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('votes')
          .insert([{ discussion_id: discussionId, user_id: user.id }]);
      }

      await fetchDiscussions();
      toast.success(hasVoted ? 'Vote removed' : 'Vote added');
    } catch (error) {
      toast.error('Error updating vote');
      console.error(error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
        <button
          onClick={() => setShowNewDiscussion(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Ask a Question</span>
        </button>
      </div>

      {showNewDiscussion && (
        <NewDiscussionForm
          onClose={() => setShowNewDiscussion(false)}
          onSuccess={() => {
            setShowNewDiscussion(false);
            fetchDiscussions();
          }}
        />
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {loading ? (
            <div className="text-center py-8">Loading discussions...</div>
          ) : discussions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No discussions yet. Be the first to start one!</div>
          ) : (
            <div className="space-y-6">
              {discussions.map((discussion) => (
                <DiscussionCard
                  key={discussion.id}
                  discussion={discussion}
                  onVote={handleVote}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Community Guidelines</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Be respectful and helpful</li>
              <li>• Share your farming experiences</li>
              <li>• Use appropriate tags for better visibility</li>
              <li>• Keep discussions on topic</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {['Planting', 'Irrigation', 'Pest Control', 'Harvesting', 'Weather'].map((tag) => (
                <span
                  key={tag}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscussionCard({
  discussion,
  onVote
}: {
  discussion: Discussion & { author: Profile; votes: number; hasVoted: boolean };
  onVote: (id: string, hasVoted: boolean) => Promise<void>;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{discussion.title}</h3>
          <div className="prose max-w-none text-gray-600 mb-4">
            <ReactMarkdown>{discussion.content}</ReactMarkdown>
          </div>
        </div>
        <button
          onClick={() => onVote(discussion.id, discussion.hasVoted)}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
            discussion.hasVoted
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
          }`}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{discussion.votes}</span>
        </button>
      </div>
      <div className="flex items-center text-gray-600 mt-4">
        <User className="h-4 w-4 mr-1" />
        <span className="mr-4">{discussion.author?.full_name}</span>
        <span className="text-sm">
          {format(new Date(discussion.created_at), 'MMM d, yyyy')}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {discussion.tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function NewDiscussionForm({
  onClose,
  onSuccess
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('discussions').insert([
        {
          title: formData.title,
          content: formData.content,
          tags: formData.tags,
          author_id: user.id
        }
      ]);

      if (error) throw error;

      toast.success('Discussion created successfully!');
      onSuccess();
    } catch (error) {
      toast.error('Error creating discussion');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleAddTag(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()]
        });
      }
      setTagInput('');
    }
  }

  function handleRemoveTag(tagToRemove: string) {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">New Discussion</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="What's your question?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Describe your question or discussion topic..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Press Enter to add tags"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Discussion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Community;