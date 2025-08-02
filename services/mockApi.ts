
import { Branch, UploadBatch, DashboardStats, WeeklySummaryData, CategoryBreakdownData, RMPerformanceData, FamilyGroupData, RM, ClientProfile, BranchManager, FamilyGroup, WeeklyTransactionHistory, AccountTypeInfo, AccountCategoryInfo } from '../types';

let branches: Branch[] = [
  { id: 'b1', name: 'Mumbai Main Branch', location: 'Mumbai, Maharashtra', managerId: 'bm1', status: 'Active' },
  { id: 'b2', name: 'Delhi Connaught Place', location: 'New Delhi, Delhi', managerId: 'bm2', status: 'Active' },
  { id: 'b3', name: 'Bangalore Tech Branch', location: 'Bangalore, Karnataka', managerId: 'bm3', status: 'Active' },
  { id: 'b4', name: 'Kolkata Park Street', location: 'Kolkata, West Bengal', managerId: 'bm4', status: 'Active' },
  { id: 'b5', name: 'Pune IT Park', location: 'Pune, Maharashtra', managerId: null, status: 'Pending' },
];

let rms: RM[] = [
    {id: 'rm1', name: 'Ravi Kumar', code: 'RK01', branchId: 'b1', email: 'ravi.k@coopbank.com', phone: '9876543210'},
    {id: 'rm2', name: 'Sunita Sharma', code: 'SS01', branchId: 'b1', email: 'sunita.s@coopbank.com', phone: '9876543211'},
    {id: 'rm3', name: 'Anil Singh', code: 'AS01', branchId: 'b2', email: 'anil.s@coopbank.com', phone: '9876543212'},
    {id: 'rm4', name: 'Priya Mehta', code: 'PM01', branchId: 'b3', email: 'priya.m@coopbank.com', phone: '9876543213'},
];

let branchManagers: BranchManager[] = [
    {id: 'bm1', name: 'Vikram Ahuja', code: 'VA01', branchId: 'b1', email: 'vikram.a@coopbank.com', phone: '8765432109'},
    {id: 'bm2', name: 'Deepa Khanna', code: 'DK01', branchId: 'b2', email: 'deepa.k@coopbank.com', phone: '8765432108'},
    {id: 'bm3', name: 'Sanjay Reddy', code: 'SR01', branchId: 'b3', email: 'sanjay.r@coopbank.com', phone: '8765432107'},
    {id: 'bm4', name: 'Anjali Bose', code: 'AB01', branchId: 'b4', email: 'anjali.b@coopbank.com', phone: '8765432106'},
];

let familyGroups: FamilyGroup[] = [
    {id: 'fg1', name: 'Patel Family', code: 'PATEL', branchId: 'b1'},
    {id: 'fg2', name: 'Singh Family', code: 'SINGH', branchId: 'b1'},
    {id: 'fg3', name: 'Gupta Group', code: 'GUPTA', branchId: 'b2'},
];

let accountTypes: AccountTypeInfo[] = [
  { id: 'at1', name: 'Urban' },
  { id: 'at2', name: 'Metro' },
  { id: 'at3', name: 'Rural' },
];

let accountCategories: AccountCategoryInfo[] = [
  { id: 'ac1', name: 'Owner', code: 'PR' },
  { id: 'ac2', name: 'Retail', code: 'RT' },
  { id: 'ac3', name: 'HNI', code: 'HN' },
  { id: 'ac4', name: 'Corporate', code: 'CB' },
  { id: 'ac5', name: 'MFS', code: 'MF' },
  { id: 'ac6', name: 'FDI', code: 'FD' },
  { id: 'ac7', name: 'OCB', code: 'OC' },
];

let mockClientProfiles: ClientProfile[] = [
  {
    id: 'ABCDE1234F_b1', branchId: 'b1', rmId: 'rm1', branchManagerId: 'bm1', familyGroupId: 'fg1',
    accountNumber: '1122334455', panPrimary: 'ABCDE1234F', panJoint1: null, panJoint2: null,
    nameFirstHolder: 'Amit Patel', jointName1: null, jointName2: null,
    accountType: 'Urban', accountCategory: 'RT',
    address1: '101, Marine Drive', address2: 'Opp. Flyover', address3: null, address4: null,
    city: 'Mumbai', state: 'Maharashtra', country: 'India', pinCode: '400001',
    contactMobile: '9876543210', contactEmail: 'amit.p@example.com', contactDob: '1985-05-20',
    bankName: 'HDFC Bank', bankAcNo: '50100123456789', bankIfsc: 'HDFC0000001', bankMicr: '400240001',
    accountBalance: 850000, aaBalPercentage: 85, freeBalance: 800000, freeBalPercentage: 80,
    pledgeBalance: 50000, pledgeBalPercentage: 5, pledgeLock: null, lockSBal: 0, lockDate: null, freezeZeBal: 0,
  },
   // Same client 'Amit Patel' with another account in a different branch
  {
    id: 'ABCDE1234F_b3', branchId: 'b3', rmId: 'rm4', branchManagerId: 'bm3', familyGroupId: null,
    accountNumber: '9988776655', panPrimary: 'ABCDE1234F', panJoint1: null, panJoint2: null,
    nameFirstHolder: 'Amit Patel', jointName1: null, jointName2: null,
    accountType: 'Metro', accountCategory: 'HN',
    address1: '101, Marine Drive', address2: 'Opp. Flyover', address3: null, address4: null,
    city: 'Mumbai', state: 'Maharashtra', country: 'India', pinCode: '400001',
    contactMobile: '9876543210', contactEmail: 'amit.p@example.com', contactDob: '1985-05-20',
    bankName: 'HDFC Bank', bankAcNo: '50100123456789', bankIfsc: 'HDFC0000001', bankMicr: '400240001',
    accountBalance: 1500000, aaBalPercentage: 100, freeBalance: 1500000, freeBalPercentage: 100,
    pledgeBalance: 0, pledgeBalPercentage: 0, pledgeLock: null, lockSBal: 0, lockDate: null, freezeZeBal: 0,
  },
  {
    id: 'FGHIJ5678K_b1', branchId: 'b1', rmId: 'rm2', branchManagerId: 'bm1', familyGroupId: 'fg2',
    accountNumber: '2233445566', panPrimary: 'FGHIJ5678K', panJoint1: 'KLMNO1234P', panJoint2: null,
    nameFirstHolder: 'Sunita Singh', jointName1: 'Anil Singh', jointName2: null,
    accountType: 'Metro', accountCategory: 'HN',
    address1: '45, Juhu Tara Road', address2: null, address3: null, address4: null,
    city: 'Mumbai', state: 'Maharashtra', country: 'India', pinCode: '400049',
    contactMobile: '9821098765', contactEmail: 'sunita.s@example.com', contactDob: '1978-11-12',
    bankName: 'ICICI Bank', bankAcNo: '623101234567', bankIfsc: 'ICIC0006231', bankMicr: '400229002',
    accountBalance: 2500000, aaBalPercentage: 100, freeBalance: 2500000, freeBalPercentage: 100,
    pledgeBalance: 0, pledgeBalPercentage: 0, pledgeLock: null, lockSBal: 0, lockDate: null, freezeZeBal: 0,
  },
   {
    id: 'BCDEF2345G_b1', branchId: 'b1', rmId: 'rm1', branchManagerId: 'bm1', familyGroupId: 'fg1',
    accountNumber: '6677889900', panPrimary: 'BCDEF2345G', panJoint1: null, panJoint2: null,
    nameFirstHolder: 'Sonia Patel', jointName1: null, jointName2: null,
    accountType: 'Metro', accountCategory: 'HN',
    address1: '102, Marine Drive', address2: 'Opp. Flyover', address3: null, address4: null,
    city: 'Mumbai', state: 'Maharashtra', country: 'India', pinCode: '400001',
    contactMobile: '9876543211', contactEmail: 'sonia.p@example.com', contactDob: '1988-03-15',
    bankName: 'HDFC Bank', bankAcNo: '50100123456790', bankIfsc: 'HDFC0000001', bankMicr: '400240001',
    accountBalance: 1200000, aaBalPercentage: 90, freeBalance: 1200000, freeBalPercentage: 90,
    pledgeBalance: 0, pledgeBalPercentage: 0, pledgeLock: null, lockSBal: 0, lockDate: null, freezeZeBal: 0,
  },
  {
    id: 'PQRST9012L_b2', branchId: 'b2', rmId: 'rm3', branchManagerId: 'bm2', familyGroupId: 'fg3',
    accountNumber: '3344556677', panPrimary: 'PQRST9012L', panJoint1: null, panJoint2: null,
    nameFirstHolder: 'Rajesh Gupta', jointName1: null, jointName2: null,
    accountType: 'Metro', accountCategory: 'CB',
    address1: 'B-5, Connaught Place', address2: null, address3: null, address4: null,
    city: 'New Delhi', state: 'Delhi', country: 'India', pinCode: '110001',
    contactMobile: '9988776655', contactEmail: 'rajesh.g@example.com', contactDob: '1990-01-30',
    bankName: 'SBI', bankAcNo: '30123456789', bankIfsc: 'SBIN0000691', bankMicr: '110002087',
    accountBalance: 5200000, aaBalPercentage: 90, freeBalance: 5200000, freeBalPercentage: 90,
    pledgeBalance: 0, pledgeBalPercentage: 0, pledgeLock: null, lockSBal: 0, lockDate: null, freezeZeBal: 520000,
  },
    {
    id: 'GHIJK6789L_b2', branchId: 'b2', rmId: 'rm3', branchManagerId: 'bm2', familyGroupId: 'fg3',
    accountNumber: '7788990011', panPrimary: 'GHIJK6789L', panJoint1: null, panJoint2: null,
    nameFirstHolder: 'Alok Singh', jointName1: null, jointName2: null,
    accountType: 'Urban', accountCategory: 'RT',
    address1: 'C-10, Karol Bagh', address2: null, address3: null, address4: null,
    city: 'New Delhi', state: 'Delhi', country: 'India', pinCode: '110005',
    contactMobile: '9810098100', contactEmail: 'alok.s@example.com', contactDob: '1982-07-22',
    bankName: 'Punjab National Bank', bankAcNo: '123456789012', bankIfsc: 'PUNB0123400', bankMicr: '110024001',
    accountBalance: 450000, aaBalPercentage: 100, freeBalance: 450000, freeBalPercentage: 100,
    pledgeBalance: 0, pledgeBalPercentage: 0, pledgeLock: null, lockSBal: 0, lockDate: null, freezeZeBal: 0,
  },
  {
    id: 'UVWXY3456M_b3', branchId: 'b3', rmId: 'rm4', branchManagerId: 'bm3', familyGroupId: null,
    accountNumber: '4455667788', panPrimary: 'UVWXY3456M', panJoint1: null, panJoint2: null,
    nameFirstHolder: 'Priya Krishnan', jointName1: null, jointName2: null,
    accountType: 'Urban', accountCategory: 'RT',
    address1: '112, MG Road', address2: null, address3: null, address4: null,
    city: 'Bangalore', state: 'Karnataka', country: 'India', pinCode: '560001',
    contactMobile: '9123456789', contactEmail: 'priya.k@example.com', contactDob: '1992-08-25',
    bankName: 'Axis Bank', bankAcNo: '912010012345678', bankIfsc: 'UTIB0000009', bankMicr: '560211002',
    accountBalance: 1200000, aaBalPercentage: 100, freeBalance: 1000000, freeBalPercentage: 83.33,
    pledgeBalance: 200000, pledgeBalPercentage: 16.67, pledgeLock: 'SHARES', lockSBal: 0, lockDate: '2024-01-15', freezeZeBal: 0,
  }
];

// --- Start of realistic data generation ---
const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Pari', 'Kiara', 'Ira', 'Riya', 'Myra', 'Tara', 'Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Pooja', 'Rohan', 'Neha', 'Karan', 'Deepika'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Patel', 'Kumar', 'Jain', 'Mehta', 'Shah', 'Iyer', 'Menon', 'Nair', 'Reddy', 'Naidu', 'Chopra', 'Malhotra', 'Kapoor', 'Trivedi', 'Mishra', 'Yadav'];
const cities: {[key: string]: { city: string, state: string, pinCode: string, country: string}} = {
    b1: { city: 'Mumbai', state: 'Maharashtra', pinCode: '400001', country: 'India'},
    b2: { city: 'New Delhi', state: 'Delhi', pinCode: '110001', country: 'India'},
    b3: { city: 'Bangalore', state: 'Karnataka', pinCode: '560001', country: 'India'},
    b4: { city: 'Kolkata', state: 'West Bengal', pinCode: '700001', country: 'India'},
    b5: { city: 'Pune', state: 'Maharashtra', pinCode: '411001', country: 'India'}
};
const bankNames = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra Bank', 'Yes Bank', 'IDBI Bank'];

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomPan(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    let pan = '';
    for (let i = 0; i < 5; i++) pan += chars.charAt(Math.floor(Math.random() * chars.length));
    for (let i = 0; i < 4; i++) pan += nums.charAt(Math.floor(Math.random() * nums.length));
    pan += chars.charAt(Math.floor(Math.random() * chars.length));
    return pan;
}

rms.push(
    {id: 'rm5', name: 'Alok Nath', code: 'AN01', branchId: 'b2', email: 'alok.n@coopbank.com', phone: '9876543214'},
    {id: 'rm6', name: 'Meera Desai', code: 'MD01', branchId: 'b3', email: 'meera.d@coopbank.com', phone: '9876543215'},
    {id: 'rm7', name: 'Suresh Iyer', code: 'SI01', branchId: 'b4', email: 'suresh.i@coopbank.com', phone: '9876543216'},
    {id: 'rm8', name: 'Rina Biswas', code: 'RB01', branchId: 'b1', email: 'rina.b@coopbank.com', phone: '9876543217'},
    {id: 'rm9', name: 'Kunal Verma', code: 'KV01', branchId: 'b2', email: 'kunal.v@coopbank.com', phone: '9876543218'},
    {id: 'rm10', name: 'Sonia Rao', code: 'SR02', branchId: 'b3', email: 'sonia.r@coopbank.com', phone: '9876543219'},
);

familyGroups.push(
    {id: 'fg4', name: 'Mehta Corporation', code: 'MEHTA', branchId: 'b2'},
    {id: 'fg5', name: 'Iyer Group', code: 'IYER', branchId: 'b3'},
    {id: 'fg6', name: 'Sharma Holdings', code: 'SHARMA', branchId: 'b4'},
    {id: 'fg7', name: 'Desai Partners', code: 'DESAI', branchId: 'b1'},
    {id: 'fg8', name: 'Verma Industries', code: 'VERMA', branchId: 'b2'},
    {id: 'fg9', name: 'Chopra Estates', code: 'CHOPRA', branchId: 'b1'},
);

const panSet = new Set(mockClientProfiles.map(c => c.panPrimary));

for (let i = 0; i < 100; i++) {
    const branch = getRandomElement(branches.filter(b => b.status === 'Active'));
    const branchRms = rms.filter(r => r.branchId === branch.id);
    const branchManager = branchManagers.find(bm => bm.branchId === branch.id);
    const branchFgs = familyGroups.filter(fg => fg.branchId === branch.id);

    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const fullName = `${firstName} ${lastName}`;
    
    let pan = generateRandomPan();
    while(panSet.has(pan)) {
        pan = generateRandomPan();
    }
    panSet.add(pan);

    const accountBalance = Math.floor(Math.random() * 5000000) + 50000;
    const freeBalance = accountBalance * (Math.random() * 0.4 + 0.6); // 60-100% of total
    const pledgeBalance = accountBalance - freeBalance;

    const newClient: ClientProfile = {
        id: `${pan}_${branch.id}`,
        branchId: branch.id,
        rmId: branchRms.length > 0 ? getRandomElement(branchRms).id : '',
        branchManagerId: branchManager ? branchManager.id : '',
        familyGroupId: Math.random() > 0.6 && branchFgs.length > 0 ? getRandomElement(branchFgs).id : null,
        accountNumber: (Math.floor(Math.random() * 9000000000) + 1000000000).toString(),
        panPrimary: pan,
        panJoint1: null,
        panJoint2: null,
        nameFirstHolder: fullName,
        jointName1: null,
        jointName2: null,
        accountType: getRandomElement(accountTypes).name,
        accountCategory: getRandomElement(accountCategories).code,
        address1: `${Math.floor(Math.random() * 900) + 100}, Random Street`,
        address2: `Area ${i+1}`,
        address3: null,
        address4: null,
        city: cities[branch.id as keyof typeof cities].city,
        state: cities[branch.id as keyof typeof cities].state,
        country: 'India',
        pinCode: cities[branch.id as keyof typeof cities].pinCode,
        contactMobile: `9${String(Math.floor(Math.random() * 900000000) + 100000000)}`,
        contactEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        contactDob: `${Math.floor(Math.random() * 28) + 1970}-${String(Math.floor(Math.random() * 12) + 1).padStart(2,'0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2,'0')}`,
        bankName: getRandomElement(bankNames),
        bankAcNo: (Math.floor(Math.random() * 900000000000) + 100000000000).toString(),
        bankIfsc: `${getRandomElement(['HDFC', 'ICIC', 'SBIN', 'UTIB', 'KKBK'])}000${Math.floor(Math.random() * 900) + 100}`,
        bankMicr: `${cities[branch.id as keyof typeof cities].pinCode.substring(0,3)}${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 900) + 100}`,
        accountBalance: accountBalance,
        aaBalPercentage: 100,
        freeBalance: freeBalance,
        freeBalPercentage: (freeBalance / accountBalance) * 100,
        pledgeBalance: pledgeBalance,
        pledgeBalPercentage: (pledgeBalance / accountBalance) * 100,
        pledgeLock: pledgeBalance > 0 ? 'SHARES' : null,
        lockSBal: 0,
        lockDate: null,
        freezeZeBal: 0,
    };
    mockClientProfiles.push(newClient);
}
// --- End of realistic data generation ---


const uploads: UploadBatch[] = [
  { id: 'u1', branchId: 'b1', weekEnding: '2024-07-06', version: 2, uploadTime: '2024-07-07T10:00:00Z', status: 'Active', totalCR: 125000, totalDR: 110000 },
  { id: 'u2', branchId: 'b1', weekEnding: '2024-07-06', version: 1, uploadTime: '2024-07-07T09:00:00Z', status: 'Corrected', totalCR: 120000, totalDR: 100000 },
  { id: 'u3', branchId: 'b2', weekEnding: '2024-07-06', version: 1, uploadTime: '2024-07-07T11:00:00Z', status: 'Active', totalCR: 250000, totalDR: 210000 },
  { id: 'u4', branchId: 'b3', weekEnding: '2024-07-06', version: 1, uploadTime: '2024-07-07T12:00:00Z', status: 'Active', totalCR: 95000, totalDR: 80000 },
  { id: 'u5', branchId: 'b1', weekEnding: '2024-06-29', version: 1, uploadTime: '2024-06-30T10:00:00Z', status: 'Active', totalCR: 115000, totalDR: 100000 },
  { id: 'u6', branchId: 'b2', weekEnding: '2024-06-29', version: 1, uploadTime: '2024-06-30T11:00:00Z', status: 'Active', totalCR: 240000, totalDR: 220000 },
  { id: 'u7', branchId: 'b4', weekEnding: '2024-06-29', version: 1, uploadTime: '2024-06-30T13:00:00Z', status: 'Pending', totalCR: 0, totalDR: 0 },
  { id: 'u8', branchId: 'b3', weekEnding: '2024-06-29', version: 1, uploadTime: '2024-06-30T10:00:00Z', status: 'Active', totalCR: 15000, totalDR: 18000 },
];

const MOCK_DELAY = 500;

export const api = {
  getBranches: async (): Promise<Branch[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...branches]), MOCK_DELAY));
  },
  getBranchManagementList: async (): Promise<(Branch & { clientCount: number, managerName: string })[]> => {
    return new Promise(resolve => {
        const data = branches.map(branch => {
            const clientCount = mockClientProfiles.filter(c => c.branchId === branch.id).length;
            const manager = branchManagers.find(bm => bm.id === branch.managerId);
            return {
                ...branch,
                clientCount,
                managerName: manager ? manager.name : 'Unassigned',
            };
        });
        setTimeout(() => resolve(data), MOCK_DELAY);
    });
  },
  addBranch: async (data: Omit<Branch, 'id'>): Promise<Branch> => {
    const newBranch: Branch = { ...data, id: `b${Date.now()}`};
    branches.push(newBranch);
    return new Promise(resolve => setTimeout(() => resolve(newBranch), MOCK_DELAY));
  },
  updateBranch: async (branchId: string, updates: Partial<Omit<Branch, 'id'>>): Promise<Branch> => {
    const branchIndex = branches.findIndex(b => b.id === branchId);
    if (branchIndex === -1) throw new Error("Branch not found");
    
    branches[branchIndex] = { ...branches[branchIndex], ...updates };
    return new Promise(resolve => setTimeout(() => resolve(branches[branchIndex]), MOCK_DELAY));
  },
  deleteBranch: async (branchId: string): Promise<{ success: boolean }> => {
    const initialLength = branches.length;
    branches = branches.filter(b => b.id !== branchId);
    return new Promise(resolve => setTimeout(() => resolve({ success: branches.length < initialLength }), MOCK_DELAY));
  },
  getRms: async (): Promise<RM[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...rms]), MOCK_DELAY));
  },
  getBranchManagers: async (): Promise<BranchManager[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...branchManagers]), MOCK_DELAY));
  },
  getFamilyGroups: async (): Promise<FamilyGroup[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...familyGroups]), MOCK_DELAY));
  },
  addRm: async(data: Omit<RM, 'id'>): Promise<RM> => {
    const newRm: RM = { ...data, id: `rm${Date.now()}`};
    rms.push(newRm);
    return new Promise(resolve => setTimeout(() => resolve(newRm), MOCK_DELAY));
  },
  addBranchManager: async(data: Omit<BranchManager, 'id'>): Promise<BranchManager> => {
    const newBm: BranchManager = { ...data, id: `bm${Date.now()}`};
    branchManagers.push(newBm);
    return new Promise(resolve => setTimeout(() => resolve(newBm), MOCK_DELAY));
  },
  addFamilyGroup: async(data: Omit<FamilyGroup, 'id'>): Promise<FamilyGroup> => {
    const newFg: FamilyGroup = { ...data, id: `fg${Date.now()}`};
    familyGroups.push(newFg);
    return new Promise(resolve => setTimeout(() => resolve(newFg), MOCK_DELAY));
  },
  getAccountTypes: async (): Promise<AccountTypeInfo[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...accountTypes]), MOCK_DELAY / 2));
  },
  addAccountType: async(data: Omit<AccountTypeInfo, 'id'>): Promise<AccountTypeInfo> => {
      const newAt: AccountTypeInfo = { ...data, id: `at${Date.now()}`};
      accountTypes.push(newAt);
      return new Promise(resolve => setTimeout(() => resolve(newAt), MOCK_DELAY));
  },
  updateAccountType: async(id: string, updates: Partial<Omit<AccountTypeInfo, 'id'>>): Promise<AccountTypeInfo> => {
      const index = accountTypes.findIndex(at => at.id === id);
      if(index === -1) throw new Error("Account Type not found");
      accountTypes[index] = { ...accountTypes[index], ...updates };
      return new Promise(resolve => setTimeout(() => resolve(accountTypes[index]), MOCK_DELAY));
  },
  deleteAccountType: async(id: string): Promise<{success: boolean}> => {
      const initialLength = accountTypes.length;
      accountTypes = accountTypes.filter(at => at.id !== id);
      return new Promise(resolve => setTimeout(() => resolve({ success: accountTypes.length < initialLength }), MOCK_DELAY));
  },
  getAccountCategories: async(): Promise<AccountCategoryInfo[]> => {
      return new Promise(resolve => setTimeout(() => resolve([...accountCategories]), MOCK_DELAY / 2));
  },
  addAccountCategory: async(data: Omit<AccountCategoryInfo, 'id'>): Promise<AccountCategoryInfo> => {
      const newAc: AccountCategoryInfo = { ...data, id: `ac${Date.now()}`};
      accountCategories.push(newAc);
      return new Promise(resolve => setTimeout(() => resolve(newAc), MOCK_DELAY));
  },
  updateAccountCategory: async(id: string, updates: Partial<Omit<AccountCategoryInfo, 'id'>>): Promise<AccountCategoryInfo> => {
      const index = accountCategories.findIndex(ac => ac.id === id);
      if(index === -1) throw new Error("Account Category not found");
      accountCategories[index] = { ...accountCategories[index], ...updates };
      return new Promise(resolve => setTimeout(() => resolve(accountCategories[index]), MOCK_DELAY));
  },
  deleteAccountCategory: async(id: string): Promise<{success: boolean}> => {
      const initialLength = accountCategories.length;
      accountCategories = accountCategories.filter(ac => ac.id !== id);
      return new Promise(resolve => setTimeout(() => resolve({ success: accountCategories.length < initialLength }), MOCK_DELAY));
  },

  updateClientProfile: async(clientId: string, updates: Partial<Pick<ClientProfile, 'rmId' | 'branchManagerId' | 'familyGroupId'>>): Promise<ClientProfile> => {
    const clientIndex = mockClientProfiles.findIndex(c => c.id === clientId);
    if (clientIndex === -1) throw new Error("Client not found");
    
    mockClientProfiles[clientIndex] = { ...mockClientProfiles[clientIndex], ...updates };
    return new Promise(resolve => setTimeout(() => resolve(mockClientProfiles[clientIndex]), MOCK_DELAY));
  },
  updateClientAssignments: async (clientIds: string[], updates: { rmId?: string; branchManagerId?: string; familyGroupId?: string | null }): Promise<number> => {
    let updatedCount = 0;
    mockClientProfiles.forEach((client, index) => {
      if (clientIds.includes(client.id)) {
        mockClientProfiles[index] = { ...client, ...updates };
        updatedCount++;
      }
    });
    return new Promise(resolve => setTimeout(() => resolve(updatedCount), MOCK_DELAY));
  },
  getRmById: (id: string) => rms.find(r => r.id === id),
  getBranchManagerById: (id: string) => branchManagers.find(bm => bm.id === id),
  getFamilyGroupById: (id: string) => familyGroups.find(fg => fg.id === id),

  getAllClients: async (): Promise<Pick<ClientProfile, 'panPrimary' | 'nameFirstHolder'>[]> => {
    const uniqueClients = mockClientProfiles.reduce((acc, client) => {
        if (!acc[client.panPrimary]) {
            acc[client.panPrimary] = { panPrimary: client.panPrimary, nameFirstHolder: client.nameFirstHolder};
        }
        return acc;
    }, {} as {[key: string]: Pick<ClientProfile, 'panPrimary' | 'nameFirstHolder'>});
    return new Promise(resolve => setTimeout(() => resolve(Object.values(uniqueClients)), MOCK_DELAY));
  },
  getBranchById: async (id: string): Promise<Branch | undefined> => {
    return new Promise(resolve => setTimeout(() => resolve(branches.find(b => b.id === id)), MOCK_DELAY));
  },
  getRecentUploads: async (limit: number = 5): Promise<UploadBatch[]> => {
    const sortedUploads = [...uploads].sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime());
    return new Promise(resolve => setTimeout(() => resolve(sortedUploads.slice(0, limit)), MOCK_DELAY));
  },
  getAllUploads: async (): Promise<UploadBatch[]> => {
      return new Promise(resolve => setTimeout(() => resolve(uploads), MOCK_DELAY));
  },
  getClientsByPan: async (pan: string): Promise<ClientProfile[]> => {
    const clientProfiles = mockClientProfiles.filter(c => c.panPrimary.toUpperCase() === pan.toUpperCase());
    return new Promise(resolve => setTimeout(() => resolve(clientProfiles), MOCK_DELAY));
  },
  getDashboardStats: async (branchId: string): Promise<DashboardStats> => {
    const branchClients = mockClientProfiles.filter(c => c.branchId === branchId);
    const branchUploads = uploads.filter(u => u.branchId === branchId);

    const totalClients = branchClients.length;
    const totalBalance = branchClients.reduce((sum, client) => sum + client.accountBalance, 0);
    const latestActiveUpload = branchUploads.filter(u => u.status === 'Active').sort((a,b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime())[0];
    const netMovement = latestActiveUpload ? latestActiveUpload.totalCR - latestActiveUpload.totalDR : 0;
    
    // Simulate upload warning for Kolkata branch
    let uploadWarning = null;
    if (branchId === 'b4') {
        uploadWarning = 'Missing upload for week ending 2024-07-06'
    }

    const stats: DashboardStats = {
      totalClients,
      totalBalance,
      netMovement,
      activeUploadVersion: latestActiveUpload ? `v${latestActiveUpload.version}` : '-',
      uploadWarning
    };

    return new Promise(resolve => setTimeout(() => resolve(stats), MOCK_DELAY));
  },
  getWeeklySummary: async (branchId: string): Promise<WeeklySummaryData[]> => {
      const data: WeeklySummaryData[] = [
          { week: '2024-06-15', totalCR: 100000, totalDR: 80000, clientsUpdated: 15, kycChanges: 5},
          { week: '2024-06-22', totalCR: 110000, totalDR: 95000, clientsUpdated: 12, kycChanges: 2},
          { week: '2024-06-29', totalCR: 115000, totalDR: 100000, clientsUpdated: 20, kycChanges: 8},
          { week: '2024-07-06', totalCR: 125000, totalDR: 110000, clientsUpdated: 18, kycChanges: 4},
      ];
      return new Promise(resolve => setTimeout(() => resolve(data), MOCK_DELAY));
  },
  getCategoryBreakdown: async (branchId: string): Promise<CategoryBreakdownData[]> => {
      const branchClients = mockClientProfiles.filter(c => c.branchId === branchId);
      const categoryMap = new Map(accountCategories.map(c => [c.code, c.name]));

      const breakdown = branchClients.reduce((acc, client) => {
          const categoryName = categoryMap.get(client.accountCategory) || client.accountCategory;
          if(!acc[categoryName]) {
              acc[categoryName] = { totalClients: 0, balance: 0, cr: 0, dr: 0 };
          }
          acc[categoryName].totalClients += 1;
          acc[categoryName].balance += client.accountBalance;
          // Mock CR/DR for breakdown
          acc[categoryName].cr += client.accountBalance * 0.1;
          acc[categoryName].dr += client.accountBalance * 0.08;
          return acc;
      }, {} as {[key: string]: Omit<CategoryBreakdownData, 'categoryName'>});

      const data: CategoryBreakdownData[] = Object.entries(breakdown).map(([catName, values]) => ({
          categoryName: catName,
          ...values
      }));
      return new Promise(resolve => setTimeout(() => resolve(data), MOCK_DELAY));
  },
  getRMPerformance: async (branchId: string): Promise<RMPerformanceData[]> => {
      const branchRms = rms.filter(r => r.branchId === branchId);
      const data: RMPerformanceData[] = branchRms.map(rm => {
        const rmClients = mockClientProfiles.filter(c => c.rmId === rm.id);
        const totalPortfolio = rmClients.reduce((sum, client) => sum + client.accountBalance, 0);
        return {
          rmId: rm.id,
          rmName: rm.name,
          clients: rmClients.length,
          totalPortfolio: totalPortfolio,
          weeklyChange: totalPortfolio * (Math.random() * 0.1 - 0.04) // random +- change
        }
      });
      return new Promise(resolve => setTimeout(() => resolve(data), MOCK_DELAY));
  },
    getFamilyGroupSummary: async (branchId: string): Promise<FamilyGroupData[]> => {
        const branchClients = mockClientProfiles.filter(c => c.branchId === branchId);
        
        const groups = branchClients.reduce((acc, client) => {
            const familyGroupId = client.familyGroupId;
            if(!familyGroupId) return acc;

            const group = familyGroups.find(fg => fg.id === familyGroupId);
            if (!group) return acc;

            if (!acc[familyGroupId]) {
                acc[familyGroupId] = { groupId: familyGroupId, groupName: group.name, clients: 0, combinedBalance: 0 };
            }
            acc[familyGroupId].clients += 1;
            acc[familyGroupId].combinedBalance += client.accountBalance;
            return acc;
        }, {} as { [key: string]: FamilyGroupData });
        
        const data: FamilyGroupData[] = Object.values(groups);

        return new Promise(resolve => setTimeout(() => resolve(data), MOCK_DELAY));
    },
    getWeekEndingDates: async (): Promise<string[]> => {
        const dates: string[] = [];
        let currentDate = new Date();
        // find last saturday
        currentDate.setDate(currentDate.getDate() - (currentDate.getDay() + 1) % 7);
        for(let i=0; i < 12; i++) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() - 7);
        }
        return new Promise(resolve => setTimeout(() => resolve(dates), 100));
    },
    getAvailableWeeksForBranch: async (branchId: string): Promise<string[]> => {
        const branchUploads = uploads.filter(u => u.branchId === branchId && u.status !== 'Pending');
        const uniqueWeeks = [...new Set(branchUploads.map(u => u.weekEnding))];
        uniqueWeeks.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        return new Promise(resolve => setTimeout(() => resolve(uniqueWeeks), MOCK_DELAY / 2));
    },
    getBranchClientsForWeek: async (branchId: string, weekEnding: string): Promise<ClientProfile[]> => {
        const branchClients = mockClientProfiles.filter(c => c.branchId === branchId);
        
        // Simulate data changes based on week to make it look dynamic
        const weekSeed = weekEnding.split('-').reduce((acc, val) => acc + parseInt(val), 0);

        const clientsForWeek = branchClients.map(client => {
          const seed = weekSeed + client.panPrimary.charCodeAt(5);
          const randomFactor = 1 + ((seed % 100) - 50) / 1000; // between 0.95 and 1.05
          
          const newBalance = Math.round(client.accountBalance * randomFactor);
          const change = newBalance - client.accountBalance;
          
          return {
            ...client,
            accountBalance: newBalance,
            freeBalance: Math.round(client.freeBalance * randomFactor),
            pledgeBalance: client.pledgeBalance + (change > 0 ? change * 0.1 : 0), // Adjust other balances a bit
            weeklyCr: change > 0 ? change : 0,
            weeklyDr: change < 0 ? -change : 0,
          }
        });

        return new Promise(resolve => setTimeout(() => resolve(clientsForWeek), MOCK_DELAY));
    },
    getClientWeeklyTransactions: async (pan: string, branchId: string): Promise<WeeklyTransactionHistory[]> => {
        const client = mockClientProfiles.find(c => c.panPrimary === pan && c.branchId === branchId);
        if (!client) {
            return [];
        }

        const history: WeeklyTransactionHistory[] = [];
        let balance = client.accountBalance;

        const availableWeeks = uploads.filter(u => u.branchId === branchId && u.status !== 'Pending')
            .map(u => u.weekEnding)
            .filter((v, i, a) => a.indexOf(v) === i)
            .sort((a,b) => new Date(b).getTime() - new Date(a).getTime())
            .slice(0, 8); // get last 8 weeks

        for (const week of availableWeeks) {
            const seed = week.split('-').reduce((acc, val) => acc + parseInt(val), 0) + client.panPrimary.charCodeAt(5);
            const randomFactor = 1 - ((seed % 100)) / 2000; // between 0.95 and 1
            
            const prevBalance = Math.round(balance * randomFactor);
            const change = balance - prevBalance;

            history.push({
                weekEnding: week,
                closingBalance: balance,
                weeklyCr: change > 0 ? change : 0,
                weeklyDr: change < 0 ? -change : 0,
            });

            balance = prevBalance;
        }

        return new Promise(resolve => setTimeout(() => resolve(history), MOCK_DELAY / 2));
    },
    getClientsByRmId: async (rmId: string, branchId: string): Promise<ClientProfile[]> => {
      const clients = mockClientProfiles.filter(c => c.rmId === rmId && c.branchId === branchId);
      const clientsWithWeeklyData = clients.map(client => ({
          ...client,
          weeklyCr: client.accountBalance * (Math.random() * 0.05),
          weeklyDr: client.accountBalance * (Math.random() * 0.03),
      }));
      return new Promise(resolve => setTimeout(() => resolve(clientsWithWeeklyData), MOCK_DELAY / 2));
    },
    getClientsByFamilyGroupId: async (groupId: string, branchId: string): Promise<ClientProfile[]> => {
      const clients = mockClientProfiles.filter(c => c.familyGroupId === groupId && c.branchId === branchId);
      const clientsWithWeeklyData = clients.map(client => ({
          ...client,
          weeklyCr: client.accountBalance * (Math.random() * 0.05),
          weeklyDr: client.accountBalance * (Math.random() * 0.03),
      }));
      return new Promise(resolve => setTimeout(() => resolve(clientsWithWeeklyData), MOCK_DELAY / 2));
    }
};
