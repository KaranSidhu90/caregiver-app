export const formatZipCode = (zipCode: string = '') => {
  return zipCode?.replace(/[^A-Za-z0-9]/g, '') 
  .replace(/(\w{3})(\w{3})/, '$1 $2').toUpperCase();
}