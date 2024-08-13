export const getAvatarUrl = (name: string, imageUrl?: string, bgColor: string = '295259', color: string = 'ffffff'): string => {
  return imageUrl
    ? imageUrl
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=${color}&size=200&rounded=true`;
};


export const calculateAge = (birthdate: Date | string): number => {
  const birthDateObj = new Date(birthdate);
  const today = new Date();
  
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();

  // If the birth month hasn't occurred yet this year, or it's the current month but the birthdate hasn't passed yet, subtract one year from the age.
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }

  return age;
};