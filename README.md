# Github Spotlight

Github Spotlight - Search repositories without headache. Created by Raihan Nismara.

[View Demo](https://github-spotlight-snowy.vercel.app/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm installed on your machine. You can use nvm (Node Version Manager) to install them.

- [Install nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

1. Clone the repo
   ```sh
   git clone <YOUR_GIT_URL>
   ```
2. Navigate to the project directory
   ```sh
   cd <YOUR_PROJECT_NAME>
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Start the development server
   ```sh
   npm run dev
   ```

## Architecture

This project follows a component-based architecture using React and TypeScript. The structure is organized to separate concerns and enhance maintainability.

- **`src/components`**: Contains reusable UI components that are used across the application.
- **`src/pages`**: Holds the main pages of the application, which are composed of smaller components.
- **`src/context`**: Manages the global state of the application using React's Context API.
- **`src/services`**: Handles API requests to the GitHub API.
- **`src/types`**: Defines the TypeScript types used throughout the project.

## State Management

The application's state is managed globally using React's Context API and the `useReducer` hook, which are combined in the `GitHubContext`.

- **`GitHubContext.tsx`**: This file defines the state structure (`GitHubState`), the possible actions (`GitHubAction`), and the reducer function (`gitHubReducer`). It also provides the `GitHubProvider` component, which wraps the application and makes the state available to all components.
- **`useGitHub` hook**: A custom hook that allows any component to access the `state` and `dispatch` function from the `GitHubContext`.

The `GitHubState` includes:

- `user`: The currently searched GitHub user.
- `repositories`: A list of the user's repositories.
- `selectedRepository`: The repository currently being viewed in detail.
- `readme`: The content of the selected repository's README file.
- `loading`: A boolean to indicate when an API request is in progress.
- `error`: A string to store any error messages.

## Component Breakdown

### Core Components

- **`SearchForm.tsx`**: A form that allows users to search for a GitHub user by their username. It handles form submission, calls the GitHub API, and updates the global state with the fetched data.
- **`UserProfile.tsx`**: Displays the profile information of the searched user, including their avatar, name, bio, and other details.
- **`RepositoryList.tsx`**: Renders a list of the user's repositories. It includes features like pagination and allows users to select a repository to view its details.
- **`RepositoryDetail.tsx`**: Shows detailed information about a selected repository, including its README file.

### Layout and UI Components

- **`Navbar.tsx`**: The main navigation bar of the application.
- **`Footer.tsx`**: The footer of the application.
- **`ThemeToggle.tsx`**: A button that allows users to switch between light and dark themes.
- **`InitialStateAnimation.tsx`**: An animation that is displayed on the initial screen before any search is performed.

## Data Flow

1. The user enters a GitHub username in the **`SearchForm`** and submits the form.
2. The `handleSubmit` function in **`SearchForm`** dispatches a `SET_LOADING` action to show a loading indicator.
3. It then calls the `getUser` and `getUserRepositories` functions from **`githubApi`** to fetch the user's data.
4. If the API call is successful, the fetched data is used to update the global state by dispatching `SET_USER` and `SET_REPOSITORIES` actions.
5. If the API call fails, a `SET_ERROR` action is dispatched, and an error message is displayed.
6. The **`GitHubExplorer`** page listens for changes in the state and conditionally renders the **`UserProfile`** and **`RepositoryList`** components when the user data is available.
7. When a user clicks on a repository in the **`RepositoryList`**, a `SET_SELECTED_REPOSITORY` action is dispatched.
8. This triggers the rendering of the **`RepositoryDetail`** component, which then fetches and displays the repository's README.

## Built With

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
