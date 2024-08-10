export const getAvatarUrl = (name: string, imageUrl?: string, bgColor: string = '295259', color: string = 'ffffff'): string => {
  return imageUrl
    ? imageUrl
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=${color}&size=200&rounded=true`;
};
