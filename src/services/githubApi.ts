import { GitHubUser, GitHubRepository, GitHubReadme } from '@/types/github';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'GitHubApiError';
  }
}

async function fetchFromGitHub(endpoint: string) {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Glance-App',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new GitHubApiError(
      errorData.message || `GitHub API error: ${response.status}`,
      response.status
    );
  }

  return response.json();
}

export const githubApi = {
  async getUser(username: string): Promise<GitHubUser> {
    return fetchFromGitHub(`/users/${username}`);
  },

  async getUserRepositories(username: string): Promise<GitHubRepository[]> {
    const repos = await fetchFromGitHub(`/users/${username}/repos?sort=updated&per_page=100`);
    return repos;
  },

  async getRepositoryReadme(owner: string, repo: string): Promise<GitHubReadme> {
    try {
      return await fetchFromGitHub(`/repos/${owner}/${repo}/readme`);
    } catch (error) {
      if (error instanceof GitHubApiError && error.status === 404) {
        throw new GitHubApiError('README not found for this repository');
      }
      throw error;
    }
  },

  decodeBase64Content(content: string): string {
    try {
      return atob(content.replace(/\s/g, ''));
    } catch (error) {
      throw new Error('Failed to decode README content');
    }
  }
};