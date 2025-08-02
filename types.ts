
export interface AccountTypeInfo {
  id: string;
  name: string;
}

export interface AccountCategoryInfo {
  id: string;
  name: string;
  code: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  managerId: string | null;
  status: 'Active' | 'Inactive' | 'Pending';
}

export interface RM {
  id: string;
  name: string;
  code: string;
  branchId: string;
  email: string;
  phone: string;
}

export interface BranchManager {
    id: string;
    name: string;
    code: string;
    branchId: string;
    email: string;
    phone: string;
}

export interface FamilyGroup {
    id: string;
    name: string;
    code: string;
    branchId: string;
}

export interface ClientProfile {
  id: string; // PAN_Primary
  branchId: string;
  rmId: string;
  branchManagerId: string;
  familyGroupId: string | null;
  // Account Details
  accountNumber: string;
  panPrimary: string;
  panJoint1: string | null;
  panJoint2: string | null;
  nameFirstHolder: string;
  jointName1: string | null;
  jointName2: string | null;
  accountType: string;
  accountCategory: string;
  // Communication Details
  address1: string;
  address2: string | null;
  address3: string | null;
  address4: string | null;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  // Contact Details
  contactMobile: string;
  contactEmail: string;
  contactDob: string; // YYYY-MM-DD
  // Bank Details
  bankName: string;
  bankAcNo: string;
  bankIfsc: string;
  bankMicr: string;
  // Transaction Details
  accountBalance: number;
  aaBalPercentage: number;
  freeBalance: number;
  freeBalPercentage: number;
  pledgeBalance: number;
  pledgeBalPercentage: number;
  pledgeLock: string | null;
  lockSBal: number;
  lockDate: string | null; // YYYY-MM-DD
  freezeZeBal: number;
  // Optional fields for weekly report
  weeklyCr?: number;
  weeklyDr?: number;
}

export interface WeeklyTransactionHistory {
    weekEnding: string;
    weeklyCr: number;
    weeklyDr: number;
    closingBalance: number;
}

export interface UploadBatch {
  id: string;
  branchId: string;
  weekEnding: string; 
  version: number;
  uploadTime: string;
  status: 'Active' | 'Corrected' | 'Pending';
  totalDR: number;
  totalCR: number;
}

export interface DashboardStats {
  totalClients: number;
  totalBalance: number;
  netMovement: number;
  activeUploadVersion: string;
  uploadWarning: string | null;
}

export interface WeeklySummaryData {
  week: string;
  totalDR: number;
  totalCR: number;
  clientsUpdated: number;
  kycChanges: number;
}

export interface CategoryBreakdownData {
  categoryName: string;
  totalClients: number;
  balance: number;
  cr: number;
  dr: number;
}

export interface RMPerformanceData {
  rmId: string;
  rmName: string;
  clients: number;
  totalPortfolio: number;
  weeklyChange: number;
}

export interface FamilyGroupData {
  groupId: string;
  groupName: string;
  clients: number;
  combinedBalance: number;
}
