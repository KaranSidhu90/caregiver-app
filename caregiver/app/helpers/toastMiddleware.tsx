import { toast } from '@backpackapp-io/react-native-toast';

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  switch (type) {
    case 'success':
      toast.success(message, { duration: 3000 });
      break;
    case 'error':
      toast.error(message, { duration: 3000 });
      break;
    case 'info':
    default:
      toast(message, { duration: 3000 });
      break;
  }
};
