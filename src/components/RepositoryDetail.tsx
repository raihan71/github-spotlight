import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Download,
  Star,
  GitFork,
  Eye,
  FileText,
  Calendar,
  Code,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GitHubRepository } from '@/types/github';
import { useGitHub } from '@/context/GitHubContext';
import { githubApi, GitHubApiError } from '@/services/githubApi';
import { ReadmeViewer } from './ReadmeViewer';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface RepositoryDetailProps {
  repository: GitHubRepository;
}

export const RepositoryDetail = ({ repository }: RepositoryDetailProps) => {
  const { state, dispatch } = useGitHub();
  const [loadingReadme, setLoadingReadme] = useState(false);

  useEffect(() => {
    const fetchReadme = async () => {
      setLoadingReadme(true);
      try {
        const readme = await githubApi.getRepositoryReadme(
          repository.full_name.split('/')[0],
          repository.name,
        );
        dispatch({ type: 'SET_README', payload: readme });
      } catch (error) {
        if (error instanceof GitHubApiError) {
          console.log('README not available:', error.message);
        } else {
          toast({
            title: 'Error',
            description: 'Failed to load README',
            variant: 'destructive',
          });
        }
      } finally {
        setLoadingReadme(false);
      }
    };

    fetchReadme();
  }, [repository, dispatch]);

  const handleBack = () => {
    dispatch({ type: 'SET_SELECTED_REPOSITORY', payload: null });
    dispatch({ type: 'SET_README', payload: null });
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to repositories
        </Button>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-2xl font-bold text-primary">
                {repository.name}
              </h2>
              <span className="px-2 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                {repository.visibility}
              </span>
              {repository.fork && (
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-sm rounded-full flex items-center gap-1">
                  <GitFork className="h-3 w-3" />
                  Forked
                </span>
              )}
              {repository.archived && (
                <span className="px-2 py-1 bg-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-full">
                  Archived
                </span>
              )}
            </div>

            {repository.description && (
              <p className="text-foreground mb-4 text-lg">
                {repository.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              {repository.language && (
                <div className="flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  <span>{repository.language}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Updated {formatDate(repository.updated_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{formatFileSize(repository.size * 1024)}</span>
              </div>
              {repository.license && (
                <div className="flex items-center gap-1">
                  <span>{repository.license.name}</span>
                </div>
              )}
            </div>

            {repository.topics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {repository.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400 mb-1">
                  <Star className="h-4 w-4" />
                  <span className="text-xl font-bold">
                    {repository.stargazers_count}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Stars</div>
              </div>

              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 text-foreground mb-1">
                  <GitFork className="h-4 w-4" />
                  <span className="text-xl font-bold">
                    {repository.forks_count}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Forks</div>
              </div>

              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 text-foreground mb-1">
                  <Eye className="h-4 w-4" />
                  <span className="text-xl font-bold">
                    {repository.watchers_count}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Watchers</div>
              </div>

              {repository.open_issues_count > 0 && (
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 mb-1">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-xl font-bold">
                      {repository.open_issues_count}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">Issues</div>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <Button asChild className="w-full" variant="outline">
                <a
                  href={repository.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View on GitHub
                </a>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <a
                  href={repository.clone_url}
                  className="flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" />
                  Clone
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg">
        <div className="border-b border-border p-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5" />
            README.md
          </h3>
        </div>

        <div className="p-4">
          {loadingReadme ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : state.readme ? (
            <ReadmeViewer readme={state.readme} />
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No README available
              </h3>
              <p className="text-muted-foreground">
                This repository doesn't have a README file.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
