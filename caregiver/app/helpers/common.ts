export const getAvatarUrl = (name: string, imageUrl?: string): string => {
  return imageUrl
    ? imageUrl
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=295259&color=fff&size=200&rounded=true`;
};