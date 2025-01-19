export const getElapsedTime = (createdAt) => {
  const now = new Date();
  // Difference in milliseconds
  const diff = now - new Date(createdAt);

  // approximation
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // returning possible approximated date
  if (years > 0) return `${years}yr`;
  if (months > 0) return `${months}mo`;
  if (weeks > 0) return `${weeks}wk`;
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}min`;
  return `${seconds}s`;
};
