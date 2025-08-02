import React, { useState } from 'react';
import {
  Star,
  GitFork,
  Eye,
  AlertCircle,
  Calendar,
  Code,
  Lock,
  Archive,
  BookOpen,
} from 'lucide-react';
import { GitHubRepository } from '@/types/github';
import { useGitHub } from '@/context/GitHubContext';
import { formatDistanceToNow } from 'date-fns';

interface RepositoryListProps {
  repositories: GitHubRepository[];
}

const getLanguageColor = (language: string | null): string => {
  const colors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    'C#': '#239120',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#fa7343',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    HTML: '#e34c26',
    CSS: '#1572B6',
    Shell: '#89e051',
  };
  return colors[language || ''] || '#858585';
};

export const RepositoryList = ({ repositories }: RepositoryListProps) => {
  const { dispatch } = useGitHub();
  const [currentPage, setCurrentPage] = useState(1);
  const reposPerPage = 5;

  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = repositories.slice(indexOfFirstRepo, indexOfLastRepo);

  const totalPages = Math.ceil(repositories.length / reposPerPage);

  const handleRepositoryClick = (repository: GitHubRepository) => {
    dispatch({ type: 'SET_SELECTED_REPOSITORY', payload: repository });
    dispatch({ type: 'SET_README', payload: null });
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  if (repositories.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-medium text-foreground mb-2">
          No repositories found
        </h3>
        <p className="text-muted-foreground">
          This user doesn't have any public repositories.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground mb-4">
        Repositories ({repositories.length})
      </h3>

      <div className="grid gap-4">
        {currentRepos.map((repo) => (
          <div
            key={repo.id}
            onClick={() => handleRepositoryClick(repo)}
            className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-semibold text-primary group-hover:underline truncate">
                    {repo.name}
                  </h4>
                  {repo.private && (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                  {repo.fork && (
                    <GitFork className="h-4 w-4 text-muted-foreground" />
                  )}
                  {repo.archived && (
                    <Archive className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                {repo.description && (
                  <p className="text-muted-foreground mb-3 line-clamp-2">
                    {repo.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {repo.language && (
                    <div className="flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: getLanguageColor(repo.language),
                        }}
                      />
                      <span>{repo.language}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{repo.stargazers_count}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <GitFork className="h-4 w-4" />
                    <span>{repo.forks_count}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {formatDate(repo.updated_at)}</span>
                  </div>
                </div>

                {repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {repo.topics.slice(0, 5).map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {topic}
                      </span>
                    ))}
                    {repo.topics.length > 5 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        +{repo.topics.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex md:flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{repo.watchers_count}</span>
                </div>
                {repo.open_issues_count > 0 && (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{repo.open_issues_count}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
