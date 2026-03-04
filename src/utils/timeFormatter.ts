/**
 * Converts a local timestamp to a relative time string
 * @param dateString - Local timezone timestamp (can be ISO 8601 with T or space-separated)
 * @param _timezoneOffset - User's timezone offset in hours (not used since data is already in local time)
 * @returns Relative time string (e.g., "45 mins ago", "2 days ago")
 */
export function getRelativeTime(dateString: string, _timezoneOffset: number): string {
  // Convert space-separated format (2026-03-05 00:57:48) to ISO format with T
  // This handles both formats: "2026-03-05T00:57:48" and "2026-03-05 00:57:48"
  const normalizedString = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
  
  // Parse the local datetime string
  const pastDate = new Date(normalizedString);

  // Get current time (also in local timezone from browser)
  const now = new Date();

  // Validate dates
  if (isNaN(pastDate.getTime())) {
    return 'unknown';
  }

  // Calculate the difference in milliseconds
  const diffMs = now.getTime() - pastDate.getTime();

  // If time is in the future, return "just now"
  if (diffMs < 0) {
    return 'just now';
  }

  // Convert to different units
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // Format based on time difference
  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
}

/**
 * Gets the activity status color and emoji based on last active time
 * @param dateString - Local timezone timestamp (can be ISO 8601 with T or space-separated)
 * @param _timezoneOffset - User's timezone offset in hours (not used since data is already in local time)
 * @returns Object with color classes and emoji
 */
export function getActivityStatus(dateString: string, _timezoneOffset: number): {
  color: string;
  emoji: string;
  category: 'fresh' | 'recent' | 'stale';
} {
  // Convert space-separated format to ISO format with T
  const normalizedString = dateString.includes('T') ? dateString : dateString.replace(' ', 'T');
  
  const pastDate = new Date(normalizedString);
  const now = new Date();
  
  if (isNaN(pastDate.getTime())) {
    return {
      color: 'text-gray-500 bg-gray-500/10',
      emoji: '⚪',
      category: 'stale'
    };
  }
  
  const diffMs = now.getTime() - pastDate.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // Green: Active in last 24 hours
  if (diffHours < 24) {
    return {
      color: 'text-green-500 bg-green-500/10',
      emoji: '🟢',
      category: 'fresh'
    };
  }
  // Yellow: Active 2-7 days ago
  else if (diffDays <= 7) {
    return {
      color: 'text-yellow-500 bg-yellow-500/10',
      emoji: '🟡',
      category: 'recent'
    };
  }
  // Gray: Active more than 7 days ago
  else {
    return {
      color: 'text-gray-500 bg-gray-500/10',
      emoji: '⚪',
      category: 'stale'
    };
  }
}
