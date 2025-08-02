import React, { useState, FormEvent } from 'react';
import { Search, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGitHub } from '@/context/GitHubContext';
import { githubApi, GitHubApiError } from '@/services/githubApi';
import { toast } from '@/hooks/use-toast';

export const SearchForm = () => {
  const { state, dispatch } = useGitHub();
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_SEARCH_QUERY', payload: username.trim() });

    try {
      const [user, repositories] = await Promise.all([
        githubApi.getUser(username.trim()),
        githubApi.getUserRepositories(username.trim()),
      ]);

      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_REPOSITORIES', payload: repositories });
      dispatch({ type: 'SET_SELECTED_REPOSITORY', payload: null });
      dispatch({ type: 'SET_README', payload: null });

      toast({
        title: 'Success!',
        description: `Found ${repositories.length} repositories for ${user.login}`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof GitHubApiError
          ? error.message
          : 'Failed to fetch user data';

      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'SET_REPOSITORIES', payload: [] });

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Github className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            GitHub Spotlight
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Explore GitHub repositories and their documentation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 h-12 text-lg bg-card border-border focus:border-primary"
              disabled={state.loading}
            />
          </div>
          <Button
            type="submit"
            disabled={state.loading || !username.trim()}
            className="h-12 px-8 text-lg font-medium">
            {state.loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>

      {state.error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive font-medium">{state.error}</p>
        </div>
      )}
    </div>
  );
};
