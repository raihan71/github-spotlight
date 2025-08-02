import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GitHubUser, GitHubRepository, GitHubReadme } from '@/types/github';

interface GitHubState {
  user: GitHubUser | null;
  repositories: GitHubRepository[];
  selectedRepository: GitHubRepository | null;
  readme: GitHubReadme | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

type GitHubAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: GitHubUser | null }
  | { type: 'SET_REPOSITORIES'; payload: GitHubRepository[] }
  | { type: 'SET_SELECTED_REPOSITORY'; payload: GitHubRepository | null }
  | { type: 'SET_README'; payload: GitHubReadme | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'RESET_STATE' };

const initialState: GitHubState = {
  user: null,
  repositories: [],
  selectedRepository: null,
  readme: null,
  loading: false,
  error: null,
  searchQuery: '',
};

const gitHubReducer = (state: GitHubState, action: GitHubAction): GitHubState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_REPOSITORIES':
      return { ...state, repositories: action.payload };
    case 'SET_SELECTED_REPOSITORY':
      return { ...state, selectedRepository: action.payload };
    case 'SET_README':
      return { ...state, readme: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

const GitHubContext = createContext<{
  state: GitHubState;
  dispatch: React.Dispatch<GitHubAction>;
} | null>(null);

export const GitHubProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gitHubReducer, initialState);

  return (
    <GitHubContext.Provider value={{ state, dispatch }}>
      {children}
    </GitHubContext.Provider>
  );
};

export const useGitHub = () => {
  const context = useContext(GitHubContext);
  if (!context) {
    throw new Error('useGitHub must be used within a GitHubProvider');
  }
  return context;
};