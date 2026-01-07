
export interface Visitor {
  name: string;
  address: string;
  phone: string;
  idNumber: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  dob: string;
  age: number;
  isHead?: boolean;
}

export interface Costs {
  guideCharges: number;
  vehicleCharges: number;
  boatCharges: number;
  boatmenCharges: number;
  forestPermission: number;
  forestGuardCharges: number;
  communityContribution: number;
  commissionPercentage: number;
  serviceCharges: number;
}

export interface TourismActivity {
  id: string;
  date: string;
  time: string;
  visitors: Visitor[];
  guideName: string;
  hotelName: string;
  visitorCharges: number;
  costs: Costs;
  totalProfit: number;
}

export type ViewState = 'dashboard' | 'new-entry' | 'records' | 'reports';
