import React from 'react';
import { MapPin, Link, Calendar, Users, BookOpen } from 'lucide-react';
import { GitHubUser } from '@/types/github';
import { formatDistanceToNow } from 'date-fns';

interface UserProfileProps {
  user: GitHubUser;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className="w-24 h-24 rounded-full border-2 border-border"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user.name || user.login}</h2>
              <p className="text-muted-foreground">@{user.login}</p>
            </div>
            <div className="flex gap-4 mt-2 md:mt-0">
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">{user.public_repos}</div>
                <div className="text-sm text-muted-foreground">Repositories</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">{user.followers}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">{user.following}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </div>
          </div>

          {user.bio && (
            <p className="text-foreground mb-4">{user.bio}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {user.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{user.location}</span>
              </div>
            )}
            {user.blog && (
              <div className="flex items-center gap-1">
                <Link className="h-4 w-4" />
                <a
                  href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {user.blog}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Joined {formatDate(user.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};