import React from 'react';
import { Navbar } from '@/components/Navbar';
import { SearchForm } from '@/components/SearchForm';
import { UserProfile } from '@/components/UserProfile';
import { RepositoryList } from '@/components/RepositoryList';
import { RepositoryDetail } from '@/components/RepositoryDetail';
import { useGitHub } from '@/context/GitHubContext';
import { InitialStateAnimation } from '@/components/InitialStateAnimation';

export const GitHubExplorer = () => {
  const { state } = useGitHub();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <SearchForm />

        {!state.user && !state.loading && <InitialStateAnimation />}

        {state.user && !state.selectedRepository && (
          <div className="max-w-6xl mx-auto space-y-6">
            <UserProfile user={state.user} />
            <RepositoryList repositories={state.repositories} />
          </div>
        )}

        {state.selectedRepository && (
          <div className="max-w-6xl mx-auto">
            <RepositoryDetail repository={state.selectedRepository} />
          </div>
        )}

        {state.loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-github-text-secondary">
                Loading GitHub data...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
