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
  code: string;
  name: string;
  location: string;
  managerId: string | null;
  status: 'Active' | 'Inactive' | 'Pending';
}

export interface RM {
  id:string;
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
  id: string; // PAN_Primary + _ + branchId
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
  district: string | null;
  state: string;
  country: string;
  pinCode: string;
  // Contact Details
  contactMobile: string;
  contactEmail: string;
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
  // Deviation Tracking
  setBalance?: number;
}

export interface WeeklyTransactionHistory {
    weekEnding: string;
    weeklyCr: number;
    weeklyDr: number;
    closingBalance: number;
}

export type UploadStatus = 'Active' | 'Corrected' | 'Pending' | 'Missing';

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

export interface SoftwareVendor {
  id: string;
  name: string;
  templateName: string;
  schema: Partial<Record<keyof ClientProfile, string>>;
}

export interface Pincode {
  id: string;
  code: string;
  city: string;
  district: string;
  state: string;
  country: string;
}

// --- Deviation Tracking Interfaces ---

export interface ClientDeviationInfo {
  clientId: string;
  pan: string;
  name: string;
  setBalance: number;
  currentBalance: number;
  deviationAmount: number;
  deviationPercent: number;
}

export interface SetBalanceHistoryItem {
    id: string;
    date: string;
    setBalance: number;
    changedBy: string;
    note: string;
}

export interface ClientDeviationHistoryItem {
    week: string;
    setBalance: number;
    actualBalance: number;
    deviationPercent: number;
}

export interface RMDeviationSummary {
    rmId: string;
    totalClientsManaged: number;
    averageDeviation: number;
    highDeviationCount: number; // Clients > 10% deviation
}

export interface FamilyGroupDeviationSummary {
    groupId: string;
    groupName: string;
    memberCount: number;
    totalSetBalance: number;
    totalActualBalance: number;
    averageDeviation: number;
    members: ClientProfile[];
}

export interface PendingDeviation {
    id: string;
    clientId: string;
    clientName: string;
    pan: string;
    branchId: string;
    setBalance: number;
    newBalance: number;
    deviationPercent: number;
    weekEnding: string;
}

// --- Client 360 View ---

export interface ClientPortfolioSummary {
    pan: string;
    name: string;
    totalPortfolioValue: number;
    totalSetBalance: number;
    netDeviationAmount: number;
    netDeviationPercent: number;
}

export interface ActivityFeedItem {
    id: string;
    timestamp: string;
    branchId: string;
    pan: string;
    activityType: 'DEVIATION_APPROVAL' | 'SET_BALANCE_UPDATE' | 'ASSIGNMENT_CHANGE';
    description: string;
    author: string;
}

export interface KycChangeItem {
    id: string;
    pan: string;
    branchId: string;
    timestamp: string;
    fieldName: keyof ClientProfile;
    oldValue: string | null;
    newValue: string | null;
    author: string;
    uploadBatchId: string;
}