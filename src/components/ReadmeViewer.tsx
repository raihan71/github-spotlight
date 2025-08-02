import React, { useMemo } from 'react';
import { GitHubReadme } from '@/types/github';
import { githubApi } from '@/services/githubApi';

interface ReadmeViewerProps {
  readme: GitHubReadme;
}

export const ReadmeViewer = ({ readme }: ReadmeViewerProps) => {
  const decodedContent = useMemo(() => {
    try {
      return githubApi.decodeBase64Content(readme.content);
    } catch (error) {
      return 'Error: Could not decode README content';
    }
  }, [readme.content]);

  const renderMarkdown = (content: string) => {
    let html = content
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-semibold text-foreground mt-6 mb-3">$1</h3>',
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-xl font-semibold text-foreground mt-8 mb-4">$1</h2>',
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-2xl font-bold text-foreground mt-8 mb-4">$1</h1>',
      )

      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-muted border border-border rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm text-foreground">$1</code></pre>',
      )
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-muted px-2 py-1 rounded text-sm text-primary">$1</code>',
      )

      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>',
      )

      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />',
      )

      .replace(/^\* (.*$)/gim, '<li class="text-foreground ml-4">• $1</li>')
      .replace(/^- (.*$)/gim, '<li class="text-foreground ml-4">• $1</li>')
      .replace(
        /^\d+\. (.*$)/gim,
        '<li class="text-foreground ml-4 list-decimal">$1</li>',
      )

      .replace(/\n\n/g, '</p><p class="text-foreground mb-4">')
      .replace(/\n/g, '<br />');

    if (
      !html.startsWith('<h') &&
      !html.startsWith('<pre') &&
      !html.startsWith('<li')
    ) {
      html = `<p class="text-foreground mb-4">${html}</p>`;
    }

    return html;
  };

  return (
    <div className="prose prose-invert max-w-none">
      <div
        className="readme-content"
        dangerouslySetInnerHTML={{
          __html: renderMarkdown(decodedContent),
        }}
      />

      <style>{`
        .readme-content {
          line-height: 1.6;
        }
        .readme-content h1,
        .readme-content h2,
        .readme-content h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .readme-content h1:first-child,
        .readme-content h2:first-child,
        .readme-content h3:first-child {
          margin-top: 0;
        }
        .readme-content pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .readme-content img {
          max-width: 100%;
          height: auto;
        }
        .readme-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        .readme-content th,
        .readme-content td {
          border: 1px solid hsl(var(--border));
          padding: 0.5rem;
          text-align: left;
        }
        .readme-content th {
          background-color: hsl(var(--muted));
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};
