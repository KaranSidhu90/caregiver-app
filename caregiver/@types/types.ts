import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type CaregiverStackParamList = {
  CaregiverDashboard: undefined;
  RequestDetailScreen: { request: any };
};

export type RequestDetailScreenNavigationProp = StackNavigationProp<
  CaregiverStackParamList,
  'RequestDetailScreen'
>;

export type RequestDetailScreenRouteProp = RouteProp<
  CaregiverStackParamList,
  'RequestDetailScreen'
>;
