import { Branch, UploadBatch, DashboardStats, WeeklySummaryData, CategoryBreakdownData, RMPerformanceData, FamilyGroupData, RM, ClientProfile, BranchManager, FamilyGroup, WeeklyTransactionHistory, AccountTypeInfo, AccountCategoryInfo, SoftwareVendor, Pincode, ClientDeviationInfo, SetBalanceHistoryItem, ClientDeviationHistoryItem, RMDeviationSummary, FamilyGroupDeviationSummary, PendingDeviation, ClientPortfolioSummary, ActivityFeedItem, KycChangeItem } from '../types';

let branches: Branch[] = [
  { id: 'b1', code: 'MU1001', name: 'Mumbai Main Branch', location: 'Mumbai, Maharashtra', managerId: 'bm1', status: 'Active' },
  { id: 'b2', code: 'DE2002', name: 'Delhi Connaught Place', location: 'New Delhi, Delhi', managerId: 'bm2', status: 'Active' },
  { id: 'b3', code: 'BA3003', name: 'Bangalore Tech Branch', location: 'Bangalore, Karnataka', managerId: 'bm3', status: 'Active' },
  { id: 'b4', code: 'KO4004', name: 'Kolkata Park Street', location: 'Kolkata, West Bengal', managerId: 'bm4', status: 'Active' },
  { id: 'b5', code: 'PU5005', name: 'Pune IT Park', location: 'Pune, Maharashtra', managerId: null, status: 'Pending' },
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

let softwareVendors: SoftwareVendor[] = [
  { id: 'v1', name: 'Finacle Core', templateName: 'Standard Finacle CSV', schema: { nameFirstHolder: 'HOLDER_NAME', panPrimary: 'PAN_NO', accountBalance: 'CLOSING_BALANCE' } },
  { id: 'v2', name: 'TCS BaNCS', templateName: 'TCS Detailed Excel', schema: { nameFirstHolder: 'CustomerName', panPrimary: 'PAN', accountNumber: 'AccountID', accountBalance: 'LedgerBalance', city: 'CustomerCity' } },
  { id: 'v3', name: 'Infosys EdgeVerve', templateName: 'EdgeVerve Standard', schema: {} },
  { id: 'v4', name: 'Custom Excel Format', templateName: 'Branch Custom Template', schema: {} },
];

let pincodes: Pincode[] = [
  { id: 'pin1', code: '400001', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', country: 'India' },
  { id: 'pin2', code: '110001', city: 'New Delhi', district: 'New Delhi', state: 'Delhi', country: 'India' },
  { id: 'pin3', code: '560001', city: 'Bangalore', district: 'Bangalore Urban', state: 'Karnataka', country: 'India' },
  { id: 'pin4', code: '700001', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', country: 'India' },
  { id: 'pin5', code: '411001', city: 'Pune', district: 'Pune', state: 'Maharashtra', country: 'India' },
  { id: 'pin6', code: '400050', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra', country: 'India' },
  { id: 'pin7', code: '560066', city: 'Bangalore', district: 'Bangalore Urban', state: 'Karnataka', country: 'India' },
  { id: 'pin8', code: '110005', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi', country: 'India' },
  { id: 'pin9', code: '400049', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra', country: 'India' },
];

let mockClientProfiles: ClientProfile[] = [
  {
    id: 'ABCDE1234F_b1', branchId: 'b1', rmId: 'rm1', branchManagerId: 'bm1', familyGroupId: 'fg1',
    accountNumber: '1122334455', panPrimary: 'ABCDE1234F', panJoint1: null, panJoint2: null,
    nameFirstHolder: 'Amit Patel', jointName1: null, jointName2: null,
    accountType: 'Urban', accountCategory: 'RT',
    address1: '101, Marine Drive', address2: 'Opp. Flyover', address3: null, address4: null,
    city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', country: 'India', pinCode: '400001',
    contactMobile: '9876543210', contactEmail: 'amit.p@example.com',
    bankName: 'HDFC Bank', bankAcNo: '50100123456789', bankIfsc: 'HDFC0000001', bankMicr: '400240001',
    accountBalance: 850000, aaBalPercentage: 85, freeBalance: 800000, freeBalPercentage: 80,
    pledgeBalance: 50000, pledgeBalPercentage: 5, pledgeLock: null, lockSBal: 0, lockDate: null, freezeZeBal: 0,
    setBalance: 800000,
  },
   // Same client 'Amit Patel' with another account in a different branch
  {
    id: 'ABCDE1234F_b3', branchId: 'b3', rmId: 'rm4', branchManagerId: 'bm3', familyGroupId: null,
    accountNumber: '9988776655', panPrimary: 'ABCDE1234F', panJoint1: null, panJoint2: null,
    nameFirstHolder: 'Amit Patel', jointName1: null, jointName2: null,
    accountType: 'Metro', accountCategory: 'HN',
    address1: '55, Electronic City', address2: null, address3: null, address4: null,
    city: 'Bangalore', district: 'Bangalore Urban', state: 'Karnataka', country: 'India', pinCode: '560066',
    contactMobile: '9876543210', contactEmail: 'amit.p@example.com',
    bankName: 'HDFC Bank', bankAcNo: '50100123456789', bankIfsc: 'HDFC0000001', bankMicr: '400240001',
    accountBalance: 1500000, aaBalPercentage: 100, freeBalance: 1500000, freeBalPercentage: 100,
    pledgeBalance: 0, pledgeBalPercentage: 0, pledgeLock: null, lockSBal: 0, lockDate: null, freezeZeBal: 0,
    setBalance: 1600000,
  },
  {
    id: 'FGHIJ5678K_b1', branchId: 'b1', rmId: 'rm2', branchManagerId: 'bm1', familyGroupId: 'fg2',
    accountNumber: '2233445566', panPrimary: 'FGHIJ5678K', panJoint1: 'KLMNO1234P', panJoint2: null,
    nameFirstHolder: 'Sunita Singh', jointName1: 'Anil Singh', jointName2: null,
    accountType: 'Metro', accountCategory: 'HN',
    address1: '45, Juhu Tara Road', address2: null, address3: null, address4: null,
    city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra', country: 'India', pinCode: '400049',
    contactMobile: '9821098765', contactEmail: 'sunita.s@example.com',
    bankName: 'ICICI Bank', bankAcNo: '623101234567', bankIfsc: 'ICIC0006231', bankMicr: '400229002',
    accountBalance: 2500000, aaBalPercentage: 100, freeBalance: 2500000, freeBalPercentage: 100,
    pledgeBalance: 0, pledgeBalPercentage: 0, pledgeLock: null, lockSBal: 0, lockDate: null, freezeZeBal: 0,
    setBalance: 2500000,
  },
   {
    id: 'BCDEF2345G_b1', branchId: 'b1', rmId: 'rm1', branchManagerId: 'bm1', familyGroupId: 'fg1',
    accountNumber: '6677889900', panPrimary: 'BCDEF2345G', panJoint1: null, panJoint2: null,
    nameFirstHolder: 'Sonia Patel', jointName1: null, jointName2: null,
    accountType: 'Metro', accountCategory: 'HN',
    address1: '102, Marine Drive', address2: 'Opp. Flyover', address3: null, address4: null,
    city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', country: 'India', pinCode: '400001',
    contactMobile: '9876543211', contactEmail: 'sonia.p@example.com',
    bankName: 'HDFC Bank', bankAcNo: '50100123456790', bankIfsc: 'HDFC0000001', bankMicr: '400240001',
    accountBalance: 1200000, aaBalPercentage: 90, freeBalance: 1200000, freeBalPercentage: 90,
    pledgeBalance: 0, pledgeBalPercentage: 0, pledgeLock: null, lockSBal: 0, lockDate: null, freezeZeBal: 0,
    setBalance: 1250000,
  },
  {
    id: 'PQRST9012L_b2', branchId: 'b2', rmId: 'rm3', branchManagerId: 'bm2', familyGroupId: 'fg3',
    accountNumber: '3344556677', panPrimary: 'PQRST9012L', panJoint1: null, panJoint2: null,
    nameFirstHolder: 'Rajesh Gupta', jointName1: null, jointName2: null,
    accountType: 'Metro', accountCategory: 'CB',
    address1: 'B-5, Connaught Place', address2: null, address3: null, address4: null,
    city: 'New Delhi', district: 'New Delhi', state: 'Delhi', country: 'India', pinCode: '110001',
    contactMobile: '9988776655', contactEmail: 'rajesh.g@example.com',
    bankName: 'SBI', bankAcNo: '30123456789', bankIfsc: 'SBIN0000691', bankMicr: '110002087',
    accountBalance: 5200000, aaBalPercentage: 90, freeBalance: 5200000, freeBalPercentage: 90,
    pledgeBalance: 0, pledgeBalPercentage: 0, pledgeLock: null, lockSBal: 0, lockDate: null, freezeZeBal: 520000,
    setBalance: 4500000, // Large deviation
  },
    {
    id: 'GHIJK6789L_b2', branchId: 'b2', rmId: 'rm3', branchManagerId: 'bm2', familyGroupId: 'fg3',
    accountNumber: '7788990011', panPrimary: 'GHIJK6789L', panJoint1: null, panJoint2: null,
    nameFirstHolder: 'Alok Singh', jointName1: null, jointName2: null,
    accountType: 'Urban', accountCategory: 'RT',
    address1: 'C-10, Karol Bagh', address2: null, address3: null, address4: null,
    city: 'New Delhi', district: 'Central Delhi', state: 'Delhi', country: 'India', pinCode: '110005',
    contactMobile: '9810098100', contactEmail: 'alok.s@example.com',
    bankName: 'Punjab National Bank', bankAcNo: '123456789012', bankIfsc: 'PUNB0123400', bankMicr: '110024001',
    accountBalance: 450000, aaBalPercentage: 100, freeBalance: 450000, freeBalPercentage: 100,
    pledgeBalance: 0, pledgeBalPercentage: 0, pledgeLock: null, lockSBal: 0, lockDate: null, freezeZeBal: 0,
    setBalance: 460000,
  },
  {
    id: 'UVWXY3456M_b3', branchId: 'b3', rmId: 'rm4', branchManagerId: 'bm3', familyGroupId: null,
    accountNumber: '4455667788', panPrimary: 'UVWXY3456M', panJoint1: null, panJoint2: null,
    nameFirstHolder: 'Priya Krishnan', jointName1: null, jointName2: null,
    accountType: 'Urban', accountCategory: 'RT',
    address1: '112, MG Road', address2: null, address3: null, address4: null,
    city: 'Bangalore', district: 'Bangalore Urban', state: 'Karnataka', country: 'India', pinCode: '560001',
    contactMobile: '9123456789', contactEmail: 'priya.k@example.com',
    bankName: 'Axis Bank', bankAcNo: '912010012345678', bankIfsc: 'UTIB0000009', bankMicr: '560211002',
    accountBalance: 1200000, aaBalPercentage: 100, freeBalance: 1000000, freeBalPercentage: 83.33,
    pledgeBalance: 200000, pledgeBalPercentage: 16.67, pledgeLock: 'SHARES', lockSBal: 0, lockDate: '2024-01-15', freezeZeBal: 0,
    setBalance: 1000000, // Large deviation
  }
];

// --- Start of realistic data generation ---
const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Pari', 'Kiara', 'Ira', 'Riya', 'Myra', 'Tara', 'Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Pooja', 'Rohan', 'Neha', 'Karan', 'Deepika'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Patel', 'Kumar', 'Jain', 'Mehta', 'Shah', 'Iyer', 'Menon', 'Nair', 'Reddy', 'Naidu', 'Chopra', 'Malhotra', 'Kapoor', 'Trivedi', 'Mishra', 'Yadav'];
const branchPincodes: {[key: string]: string} = {
    b1: '400001',
    b2: '110001',
    b3: '560001',
    b4: '700001',
    b5: '411001'
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

    const pincode = branchPincodes[branch.id as keyof typeof branchPincodes];
    const locationInfo = pincodes.find(p => p.code === pincode);

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
        city: locationInfo ? locationInfo.city : 'Unknown',
        district: locationInfo ? locationInfo.district : null,
        state: locationInfo ? locationInfo.state : 'Unknown',
        country: locationInfo ? locationInfo.country : 'India',
        pinCode: pincode,
        contactMobile: `9${String(Math.floor(Math.random() * 900000000) + 100000000)}`,
        contactEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        bankName: getRandomElement(bankNames),
        bankAcNo: (Math.floor(Math.random() * 900000000000) + 100000000000).toString(),
        bankIfsc: `${getRandomElement(['HDFC', 'ICIC', 'SBIN', 'UTIB', 'KKBK'])}000${Math.floor(Math.random() * 900) + 100}`,
        bankMicr: `${pincode.substring(0,3)}${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 900) + 100}`,
        accountBalance: accountBalance,
        setBalance: Math.round(accountBalance * (1 + (Math.random() - 0.5) * 0.4)), // Set balance between 0.8x and 1.2x of accountBalance
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


let uploads: UploadBatch[] = [
  { id: 'u1', branchId: 'b1', weekEnding: '2024-07-06', version: 2, uploadTime: '2024-07-07T10:00:00Z', status: 'Active', totalCR: 125000, totalDR: 110000 },
  { id: 'u2', branchId: 'b1', weekEnding: '2024-07-06', version: 1, uploadTime: '2024-07-07T09:00:00Z', status: 'Corrected', totalCR: 120000, totalDR: 100000 },
  { id: 'u3', branchId: 'b2', weekEnding: '2024-07-06', version: 1, uploadTime: '2024-07-07T11:00:00Z', status: 'Active', totalCR: 250000, totalDR: 210000 },
  { id: 'u4', branchId: 'b3', weekEnding: '2024-07-06', version: 1, uploadTime: '2024-07-07T12:00:00Z', status: 'Active', totalCR: 95000, totalDR: 80000 },
  { id: 'u5', branchId: 'b1', weekEnding: '2024-06-29', version: 1, uploadTime: '2024-06-30T10:00:00Z', status: 'Active', totalCR: 115000, totalDR: 100000 },
  { id: 'u6', branchId: 'b2', weekEnding: '2024-06-29', version: 1, uploadTime: '2024-06-30T11:00:00Z', status: 'Active', totalCR: 240000, totalDR: 220000 },
  { id: 'u7', branchId: 'b4', weekEnding: '2024-06-29', version: 1, uploadTime: '2024-06-30T13:00:00Z', status: 'Pending', totalCR: 0, totalDR: 0 },
  { id: 'u8', branchId: 'b3', weekEnding: '2024-06-29', version: 1, uploadTime: '2024-06-30T10:00:00Z', status: 'Active', totalCR: 15000, totalDR: 18000 },
];

let managedWeekEndingDates: string[] = (() => {
    const dates: string[] = [];
    let currentDate = new Date();
    // find last saturday
    currentDate.setDate(currentDate.getDate() - (currentDate.getDay() + 1) % 7);
    for(let i=0; i < 52; i++) { // Generate for a year
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() - 7);
    }
    return dates;
})();

// --- Deviation Tracking Mock Data ---
let setBalanceHistory: SetBalanceHistoryItem[] = mockClientProfiles.map(client => ({
    id: `sbh-${client.id}`,
    date: '2024-01-01T10:00:00Z',
    setBalance: client.setBalance || client.accountBalance,
    changedBy: 'System',
    note: 'Initial set balance on system migration.'
}));

let pendingDeviations: PendingDeviation[] = [];
const recentWeeksForDeviations = managedWeekEndingDates.slice(0, 8);

mockClientProfiles.forEach(client => {
    recentWeeksForDeviations.forEach(week => {
        // Use a consistent but "random" way to decide if a deviation occurs
        const weekPart = parseInt(week.replace(/-/g, '').slice(4), 10);
        const panPart = parseInt(client.panPrimary.replace(/[A-Z]/g, '').slice(-4), 10) || 1;
        
        if ((weekPart + panPart) % 19 < 2) { // Create deviation for about ~10% of cases
             const setBalance = client.setBalance || 0;
             if (setBalance > 0) {
                // Create a significant deviation > 15%
                const deviationFactor = (Math.random() > 0.5 ? 1 : -1) * (0.16 + Math.random() * 0.3); // from 16% to 46% deviation
                const newBalance = setBalance * (1 + deviationFactor);
                const deviationPercent = Math.abs(deviationFactor * 100);

                pendingDeviations.push({
                    id: `pd-${client.id}-${week}`,
                    clientId: client.id,
                    clientName: client.nameFirstHolder,
                    pan: client.panPrimary,
                    branchId: client.branchId,
                    setBalance: setBalance,
                    newBalance: Math.round(newBalance),
                    deviationPercent: deviationPercent,
                    weekEnding: week,
                });
             }
        }
    });
});

let activityFeed: ActivityFeedItem[] = [
    ...pendingDeviations.slice(0, 5).map((p, i) => ({
        id: `act-dev-${i}`,
        timestamp: new Date(new Date(p.weekEnding).getTime() + 86400000).toISOString(),
        branchId: p.branchId,
        pan: p.pan,
        activityType: 'DEVIATION_APPROVAL' as const,
        description: `Deviation of ${p.deviationPercent.toFixed(1)}% approved for ${p.clientName}.`,
        author: 'Admin User'
    })),
    ...setBalanceHistory.slice(1, 6).map((sbh, i) => {
        const client = mockClientProfiles.find(c => c.setBalance === sbh.setBalance);
        return {
            id: `act-sbh-${i}`,
            timestamp: sbh.date,
            branchId: client?.branchId || branches[0].id,
            pan: client?.panPrimary || 'UNKNOWN',
            activityType: 'SET_BALANCE_UPDATE' as const,
            description: `Set Balance updated to ${sbh.setBalance} for ${client?.nameFirstHolder || 'a client'}. Reason: ${sbh.note}`,
            author: sbh.changedBy,
        };
    }),
    ...mockClientProfiles.slice(10, 15).map((c, i) => {
        const newRM = rms.find(r => r.branchId === c.branchId && r.id !== c.rmId);
        return {
             id: `act-asgn-${i}`,
             timestamp: new Date(Date.now() - i * 3 * 86400000).toISOString(),
             branchId: c.branchId,
             pan: c.panPrimary,
             activityType: 'ASSIGNMENT_CHANGE' as const,
             description: newRM ? `Re-assigned from ${rms.find(r=>r.id===c.rmId)?.name} to ${newRM.name}.` : 'Assignment updated.',
             author: 'System Batch'
        }
    })
].filter(item => item.pan !== 'UNKNOWN');

let kycChangeHistory: KycChangeItem[] = [];
const clientsForKycChanges = mockClientProfiles.slice(0, 30); // Increased from 10 to 30
const recentUploadBatches = uploads.filter(u => new Date(u.uploadTime) > new Date(Date.now() - 30 * 86400000));

clientsForKycChanges.forEach((client, index) => {
    if (index % 3 === 0 && recentUploadBatches.length > 0) { // Change address for some
        const upload = recentUploadBatches[index % recentUploadBatches.length];
        kycChangeHistory.push({
            id: `kyc-chg-addr-${client.id}`,
            pan: client.panPrimary,
            branchId: client.branchId,
            timestamp: upload.uploadTime,
            fieldName: 'address1',
            oldValue: client.address1,
            newValue: `New Address #${Math.floor(Math.random() * 1000)}`,
            author: 'System Upload',
            uploadBatchId: upload.id
        });
    }
    if (index % 4 === 0 && recentUploadBatches.length > 0) { // Change mobile for others
        const upload = recentUploadBatches[index % recentUploadBatches.length];
        kycChangeHistory.push({
            id: `kyc-chg-mob-${client.id}`,
            pan: client.panPrimary,
            branchId: client.branchId,
            timestamp: upload.uploadTime,
            fieldName: 'contactMobile',
            oldValue: client.contactMobile,
            newValue: `9${String(Math.floor(Math.random() * 900000000) + 100000000)}`,
            author: 'System Upload',
            uploadBatchId: upload.id
        });
    }
});


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
  updateRm: async (id: string, updates: Partial<Omit<RM, 'id'>>): Promise<RM> => {
    const index = rms.findIndex(item => item.id === id);
    if (index === -1) throw new Error("RM not found");
    rms[index] = { ...rms[index], ...updates };
    return new Promise(resolve => setTimeout(() => resolve(rms[index]), MOCK_DELAY));
  },
  deleteRm: async (rmId: string): Promise<{ success: boolean }> => {
    const initialLength = rms.length;
    rms = rms.filter(r => r.id !== rmId);
    mockClientProfiles.forEach(c => {
      if (c.rmId === rmId) c.rmId = '';
    });
    return new Promise(resolve => setTimeout(() => resolve({ success: rms.length < initialLength }), MOCK_DELAY));
  },
  addBranchManager: async(data: Omit<BranchManager, 'id'>): Promise<BranchManager> => {
    const newBm: BranchManager = { ...data, id: `bm${Date.now()}`};
    branchManagers.push(newBm);
    return new Promise(resolve => setTimeout(() => resolve(newBm), MOCK_DELAY));
  },
  updateBranchManager: async (id: string, updates: Partial<Omit<BranchManager, 'id'>>): Promise<BranchManager> => {
    const index = branchManagers.findIndex(item => item.id === id);
    if (index === -1) throw new Error("Branch Manager not found");
    branchManagers[index] = { ...branchManagers[index], ...updates };
    return new Promise(resolve => setTimeout(() => resolve(branchManagers[index]), MOCK_DELAY));
  },
  deleteBranchManager: async (bmId: string): Promise<{ success: boolean }> => {
    const initialLength = branchManagers.length;
    branchManagers = branchManagers.filter(bm => bm.id !== bmId);
    mockClientProfiles.forEach(c => {
      if (c.branchManagerId === bmId) c.branchManagerId = '';
    });
    return new Promise(resolve => setTimeout(() => resolve({ success: branchManagers.length < initialLength }), MOCK_DELAY));
  },
  addFamilyGroup: async(data: Omit<FamilyGroup, 'id'>): Promise<FamilyGroup> => {
    const newFg: FamilyGroup = { ...data, id: `fg${Date.now()}`};
    familyGroups.push(newFg);
    return new Promise(resolve => setTimeout(() => resolve(newFg), MOCK_DELAY));
  },
  updateFamilyGroup: async (id: string, updates: Partial<Omit<FamilyGroup, 'id'>>): Promise<FamilyGroup> => {
    const index = familyGroups.findIndex(item => item.id === id);
    if (index === -1) throw new Error("Family Group not found");
    familyGroups[index] = { ...familyGroups[index], ...updates };
    return new Promise(resolve => setTimeout(() => resolve(familyGroups[index]), MOCK_DELAY));
  },
  deleteFamilyGroup: async (fgId: string): Promise<{ success: boolean }> => {
    const initialLength = familyGroups.length;
    familyGroups = familyGroups.filter(fg => fg.id !== fgId);
    mockClientProfiles.forEach(c => {
        if (c.familyGroupId === fgId) c.familyGroupId = null;
    });
    return new Promise(resolve => setTimeout(() => resolve({ success: familyGroups.length < initialLength }), MOCK_DELAY));
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

  getSoftwareVendors: async (): Promise<SoftwareVendor[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...softwareVendors]), MOCK_DELAY / 2));
  },
  addSoftwareVendor: async (data: Omit<SoftwareVendor, 'id' | 'schema'>): Promise<SoftwareVendor> => {
      const newVendor: SoftwareVendor = { ...data, id: `v${Date.now()}`, schema: {} };
      softwareVendors.push(newVendor);
      return new Promise(resolve => setTimeout(() => resolve(newVendor), MOCK_DELAY));
  },
  updateSoftwareVendor: async(id: string, updates: Partial<Omit<SoftwareVendor, 'id'>>): Promise<SoftwareVendor> => {
      const index = softwareVendors.findIndex(v => v.id === id);
      if(index === -1) throw new Error("Software Vendor not found");
      softwareVendors[index] = { ...softwareVendors[index], ...updates };
      return new Promise(resolve => setTimeout(() => resolve(softwareVendors[index]), MOCK_DELAY));
  },
  deleteSoftwareVendor: async(id: string): Promise<{success: boolean}> => {
      const initialLength = softwareVendors.length;
      softwareVendors = softwareVendors.filter(v => v.id !== id);
      return new Promise(resolve => setTimeout(() => resolve({ success: softwareVendors.length < initialLength }), MOCK_DELAY));
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

  getAllClients: async (): Promise<Pick<ClientProfile, 'panPrimary' | 'nameFirstHolder' | 'contactMobile'>[]> => {
    const uniqueClients = mockClientProfiles.reduce((acc, client) => {
        if (!acc[client.panPrimary]) {
            acc[client.panPrimary] = { panPrimary: client.panPrimary, nameFirstHolder: client.nameFirstHolder, contactMobile: client.contactMobile };
        }
        return acc;
    }, {} as {[key: string]: Pick<ClientProfile, 'panPrimary' | 'nameFirstHolder' | 'contactMobile'>});
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
  getDashboardStats: async (branchId: string, weekEnding: string): Promise<DashboardStats> => {
    const branchClients = await api.getBranchClientsForWeek(branchId, weekEnding);

    const totalClients = branchClients.length;
    const totalBalance = branchClients.reduce((sum, client) => sum + client.accountBalance, 0);
    
    const totalCR = branchClients.reduce((sum, client) => sum + (client.weeklyCr || 0), 0);
    const totalDR = branchClients.reduce((sum, client) => sum + (client.weeklyDr || 0), 0);
    const netMovement = totalCR - totalDR;

    const latestActiveUpload = uploads
        .filter(u => u.branchId === branchId && u.weekEnding === weekEnding && u.status === 'Active')
        .sort((a,b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime())[0];

    // Simulate upload warning for Kolkata branch if latest week not selected
    let uploadWarning = null;
    if (branchId === 'b4' && weekEnding !== '2024-07-06') {
        uploadWarning = 'Missing upload for week ending 2024-07-06';
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
  getBranchBalanceHistory: async (branchId: string, weeks: number): Promise<{ week: string, balance: number }[]> => {
    const history: { week: string, balance: number }[] = [];
    const sortedDates = [...managedWeekEndingDates].sort((a,b) => new Date(a).getTime() - new Date(b).getTime());
    const relevantWeeks = sortedDates.slice(-weeks);

    for (const week of relevantWeeks) {
      const clients = await api.getBranchClientsForWeek(branchId, week);
      const balance = clients.reduce((sum, client) => sum + client.accountBalance, 0);
      history.push({ week, balance });
    }
    return new Promise(resolve => setTimeout(() => resolve(history), MOCK_DELAY));
  },
  getWeeklySummary: async (branchId: string, weekEnding: string): Promise<WeeklySummaryData[]> => {
      const summary: WeeklySummaryData[] = [];
      const allSortedDates = [...managedWeekEndingDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      const currentWeekIndex = allSortedDates.findIndex(d => d === weekEnding);
      
      const startIndex = Math.max(0, currentWeekIndex - 3);
      const relevantWeeks = allSortedDates.slice(startIndex, currentWeekIndex + 1);

      for (const week of relevantWeeks) {
          const weekSeed = week.split('-').reduce((acc, val) => acc + parseInt(val), 0);
          const branchSeed = branchId.charCodeAt(1);
          const seed = weekSeed + branchSeed;
          
          summary.push({
              week,
              totalCR: (seed % 100) * 1000 + 50000,
              totalDR: (seed % 80) * 1000 + 40000,
              clientsUpdated: (seed % 10) + 10,
              kycChanges: (seed % 5) + 1,
          });
      }
      return new Promise(resolve => setTimeout(() => resolve(summary), MOCK_DELAY));
  },
  getCategoryBreakdown: async (branchId: string, weekEnding: string): Promise<CategoryBreakdownData[]> => {
      const branchClients = await api.getBranchClientsForWeek(branchId, weekEnding);
      const categoryMap = new Map(accountCategories.map(c => [c.code, c.name]));

      const breakdown = branchClients.reduce((acc, client) => {
          const categoryName = categoryMap.get(client.accountCategory) || client.accountCategory;
          if(!acc[categoryName]) {
              acc[categoryName] = { totalClients: 0, balance: 0, cr: 0, dr: 0 };
          }
          acc[categoryName].totalClients += 1;
          acc[categoryName].balance += client.accountBalance;
          acc[categoryName].cr += client.weeklyCr || 0;
          acc[categoryName].dr += client.weeklyDr || 0;
          return acc;
      }, {} as {[key: string]: Omit<CategoryBreakdownData, 'categoryName'>});

      const data: CategoryBreakdownData[] = Object.entries(breakdown).map(([catName, values]) => ({
          categoryName: catName,
          ...values
      }));
      return new Promise(resolve => setTimeout(() => resolve(data), MOCK_DELAY));
  },
  getRMPerformance: async (branchId: string, weekEnding: string): Promise<RMPerformanceData[]> => {
      const branchRms = rms.filter(r => r.branchId === branchId);
      const branchClients = await api.getBranchClientsForWeek(branchId, weekEnding);

      const data: RMPerformanceData[] = branchRms.map(rm => {
        const rmClients = branchClients.filter(c => c.rmId === rm.id);
        const totalPortfolio = rmClients.reduce((sum, client) => sum + client.accountBalance, 0);
        const weeklyChange = rmClients.reduce((sum, client) => sum + ((client.weeklyCr || 0) - (client.weeklyDr || 0)), 0);
        
        return {
          rmId: rm.id,
          rmName: rm.name,
          clients: rmClients.length,
          totalPortfolio: totalPortfolio,
          weeklyChange: weeklyChange,
        }
      });
      return new Promise(resolve => setTimeout(() => resolve(data), MOCK_DELAY));
  },
    getFamilyGroupSummary: async (branchId: string, weekEnding: string): Promise<FamilyGroupData[]> => {
        const branchClients = await api.getBranchClientsForWeek(branchId, weekEnding);
        
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
        const sorted = [...managedWeekEndingDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        return new Promise(resolve => setTimeout(() => resolve(sorted), 100));
    },
    getManagedWeekEndingDates: async (): Promise<string[]> => {
      const sorted = [...managedWeekEndingDates].sort((a,b) => new Date(b).getTime() - new Date(a).getTime());
      return new Promise(resolve => setTimeout(() => resolve(sorted), 100));
    },
    getUsedWeekEndingDates: async (): Promise<Set<string>> => {
      const usedDates = new Set(uploads.map(u => u.weekEnding));
      return new Promise(resolve => setTimeout(() => resolve(usedDates), 100));
    },
    generateAndAddWeekEndingDates: async(year: number, month: number): Promise<{ addedCount: number, newDates: string[] }> => {
        let addedCount = 0;
        const newDates: string[] = [];
        const dateSet = new Set(managedWeekEndingDates);

        const startMonth = (month >= 0 && month < 12) ? month : 0;
        const endMonth = (month >= 0 && month < 12) ? month : 11;
        
        for (let currentMonth = startMonth; currentMonth <= endMonth; currentMonth++) {
            const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(Date.UTC(year, currentMonth, day));
                
                if (date.getUTCDay() === 6) { // 6 is Saturday
                    const dateString = date.toISOString().split('T')[0];
                    if(!dateSet.has(dateString)) {
                        managedWeekEndingDates.push(dateString);
                        dateSet.add(dateString);
                        newDates.push(dateString);
                        addedCount++;
                    }
                }
            }
        }
        return new Promise(resolve => setTimeout(() => resolve({ addedCount, newDates }), 200));
    },
    deleteWeekEndingDate: async(dateString: string): Promise<{ success: boolean }> => {
        const initialLength = managedWeekEndingDates.length;
        managedWeekEndingDates = managedWeekEndingDates.filter(d => d !== dateString);
        return new Promise(resolve => setTimeout(() => resolve({ success: managedWeekEndingDates.length < initialLength}), 100));
    },
    deleteAllDatesForYear: async(year: number): Promise<{ deleted: number }> => {
        const initialLength = managedWeekEndingDates.length;
        const usedDatesSet = new Set(uploads.map(u => u.weekEnding));
        managedWeekEndingDates = managedWeekEndingDates.filter(d => {
            const date = new Date(d);
            const isTargetYear = date.getUTCFullYear() === year;
            // Keep if not in target year, or if it is in use
            return !isTargetYear || usedDatesSet.has(d);
        });
        const deletedCount = initialLength - managedWeekEndingDates.length;
        return new Promise(resolve => setTimeout(() => resolve({ deleted: deletedCount }), 200));
    },
    deleteDatesForMonth: async(year: number, month: number): Promise<{ deleted: number }> => {
        const initialLength = managedWeekEndingDates.length;
        const usedDatesSet = new Set(uploads.map(u => u.weekEnding));
        managedWeekEndingDates = managedWeekEndingDates.filter(d => {
            const date = new Date(d);
            const isTargetMonth = date.getUTCFullYear() === year && date.getUTCMonth() === month;
             // Keep if not in target month, or if it is in use
            return !isTargetMonth || usedDatesSet.has(d);
        });
        const deletedCount = initialLength - managedWeekEndingDates.length;
        return new Promise(resolve => setTimeout(() => resolve({ deleted: deletedCount }), 200));
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
    getClientsByRmId: async (rmId: string, branchId: string, weekEnding: string): Promise<ClientProfile[]> => {
      const clients = await api.getBranchClientsForWeek(branchId, weekEnding);
      return new Promise(resolve => setTimeout(() => resolve(clients.filter(c => c.rmId === rmId)), MOCK_DELAY / 2));
    },
    getClientsByManager: async (managerId: string, type: 'rm' | 'bm'): Promise<ClientProfile[]> => {
        const clients = mockClientProfiles.filter(c => (type === 'rm' && c.rmId === managerId) || (type === 'bm' && c.branchManagerId === managerId));
        return new Promise(resolve => setTimeout(() => resolve(clients), MOCK_DELAY / 2));
    },
    getClientsByFamilyGroupId: async (groupId: string, branchId: string, weekEnding: string): Promise<ClientProfile[]> => {
      const clients = await api.getBranchClientsForWeek(branchId, weekEnding);
      return new Promise(resolve => setTimeout(() => resolve(clients.filter(c => c.familyGroupId === groupId)), MOCK_DELAY / 2));
    },

    // PIN Code Management
    getPincodes: async (): Promise<Pincode[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...pincodes]), MOCK_DELAY / 2));
    },
    addPincode: async (data: Omit<Pincode, 'id'>): Promise<Pincode> => {
        const newPincode: Pincode = { ...data, id: `pin${Date.now()}`};
        pincodes.push(newPincode);
        return new Promise(resolve => setTimeout(() => resolve(newPincode), MOCK_DELAY));
    },
    updatePincode: async (id: string, updates: Partial<Omit<Pincode, 'id'>>): Promise<Pincode> => {
        const index = pincodes.findIndex(p => p.id === id);
        if(index === -1) throw new Error("Pincode not found");
        pincodes[index] = { ...pincodes[index], ...updates };
        return new Promise(resolve => setTimeout(() => resolve(pincodes[index]), MOCK_DELAY));
    },
    deletePincode: async (id: string): Promise<{success: boolean}> => {
        const initialLength = pincodes.length;
        pincodes = pincodes.filter(p => p.id !== id);
        return new Promise(resolve => setTimeout(() => resolve({ success: pincodes.length < initialLength }), MOCK_DELAY));
    },
    
    // --- New Deviation Tracking API Endpoints ---
    getClientDeviation: async (clientId: string, weekEnding: string): Promise<ClientDeviationInfo> => {
        const client = (await api.getBranchClientsForWeek(clientId.split('_')[1], weekEnding)).find(c => c.id === clientId);
        if (!client) throw new Error("Client not found for deviation info");
        const setBalance = client.setBalance || 0;
        const currentBalance = client.accountBalance;
        const deviationAmount = currentBalance - setBalance;
        const deviationPercent = setBalance > 0 ? (deviationAmount / setBalance) * 100 : (currentBalance > 0 ? Infinity : 0);

        return new Promise(resolve => setTimeout(() => resolve({
            clientId: client.id,
            pan: client.panPrimary,
            name: client.nameFirstHolder,
            setBalance,
            currentBalance,
            deviationAmount,
            deviationPercent,
        }), MOCK_DELAY / 3));
    },
    
    getSetBalanceHistory: async (clientId: string): Promise<SetBalanceHistoryItem[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...setBalanceHistory]), MOCK_DELAY / 2));
    },
    
    getClientDeviationHistory: async (clientId: string): Promise<ClientDeviationHistoryItem[]> => {
        const client = mockClientProfiles.find(c => c.id === clientId);
        if(!client) return [];

        const history: ClientDeviationHistoryItem[] = [];
        const sortedDates = [...managedWeekEndingDates].sort((a,b) => new Date(a).getTime() - new Date(b).getTime()).slice(-12); // Last 12 weeks
        
        for (const week of sortedDates) {
            const weekSeed = week.split('-').reduce((acc, val) => acc + parseInt(val), 0);
            const seed = weekSeed + client.panPrimary.charCodeAt(5);
            const randomFactor = 1 + ((seed % 100) - 50) / 1000; // between 0.95 and 1.05
            const actualBalance = Math.round(client.accountBalance * randomFactor);
            const setBalance = client.setBalance || 0;
            const deviationPercent = setBalance > 0 ? ((actualBalance - setBalance) / setBalance) * 100 : 0;
            history.push({ week, setBalance, actualBalance, deviationPercent });
        }
        return new Promise(resolve => setTimeout(() => resolve(history), MOCK_DELAY));
    },
    
    updateSetBalance: async (clientId: string, newBalance: number, note: string): Promise<SetBalanceHistoryItem> => {
        const clientIndex = mockClientProfiles.findIndex(c => c.id === clientId);
        if(clientIndex > -1) {
            mockClientProfiles[clientIndex].setBalance = newBalance;
        }
        const newHistoryItem: SetBalanceHistoryItem = {
            id: `sbh-${Date.now()}`,
            date: new Date().toISOString(),
            setBalance: newBalance,
            changedBy: 'Admin User',
            note: note,
        };
        setBalanceHistory.unshift(newHistoryItem);
        return new Promise(resolve => setTimeout(() => resolve(newHistoryItem), MOCK_DELAY));
    },
    
    approveDeviation: async (pendingDeviationId: string, updateSet?: boolean, note?: string): Promise<{ success: boolean }> => {
        const deviationIndex = pendingDeviations.findIndex(p => p.id === pendingDeviationId);
        if (deviationIndex === -1) throw new Error("Pending deviation not found");

        const deviation = pendingDeviations[deviationIndex];
        if(updateSet) {
             await api.updateSetBalance(deviation.clientId, deviation.newBalance, note || `Approved deviation for week ${deviation.weekEnding}.`);
        }
        console.log(`Approved deviation ${pendingDeviationId} with note: "${note}"`);
        pendingDeviations.splice(deviationIndex, 1);
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), MOCK_DELAY));
    },
    
    rejectDeviation: async (pendingDeviationId: string, note: string): Promise<{ success: boolean }> => {
        const initialLength = pendingDeviations.length;
        pendingDeviations = pendingDeviations.filter(p => p.id !== pendingDeviationId);
        console.log(`Rejected deviation ${pendingDeviationId} with note: "${note}"`); // Simulate backend logging
        return new Promise(resolve => setTimeout(() => resolve({ success: pendingDeviations.length < initialLength }), MOCK_DELAY));
    },

    getRMDeviationSummary: async (rmId: string, weekEnding: string): Promise<RMDeviationSummary> => {
        const rmClients = (await api.getBranchClientsForWeek(rms.find(r => r.id === rmId)!.branchId, weekEnding)).filter(c => c.rmId === rmId);
        
        let totalDeviationPercent = 0;
        let highDeviationCount = 0;
        
        rmClients.forEach(client => {
            const { setBalance, accountBalance } = client;
            if (setBalance && setBalance > 0) {
                const deviation = Math.abs(((accountBalance - setBalance) / setBalance) * 100);
                totalDeviationPercent += deviation;
                if (deviation > 10) {
                    highDeviationCount++;
                }
            }
        });

        return new Promise(resolve => setTimeout(() => resolve({
            rmId,
            totalClientsManaged: rmClients.length,
            averageDeviation: rmClients.length > 0 ? totalDeviationPercent / rmClients.length : 0,
            highDeviationCount,
        }), MOCK_DELAY));
    },
    
    getGroupDeviationSummary: async (branchId: string, weekEnding: string): Promise<FamilyGroupDeviationSummary[]> => {
        const branchClients = await api.getBranchClientsForWeek(branchId, weekEnding);
        const branchGroups = familyGroups.filter(fg => fg.branchId === branchId);

        const summary: FamilyGroupDeviationSummary[] = branchGroups.map(group => {
            const members = branchClients.filter(c => c.familyGroupId === group.id);
            const totalSetBalance = members.reduce((sum, m) => sum + (m.setBalance || 0), 0);
            const totalActualBalance = members.reduce((sum, m) => sum + m.accountBalance, 0);
            
            let totalDeviation = 0;
            members.forEach(m => {
                if (m.setBalance && m.setBalance > 0) {
                     totalDeviation += Math.abs(((m.accountBalance - m.setBalance) / m.setBalance) * 100);
                }
            });

            return {
                groupId: group.id,
                groupName: group.name,
                memberCount: members.length,
                totalSetBalance,
                totalActualBalance,
                averageDeviation: members.length > 0 ? totalDeviation / members.length : 0,
                members,
            };
        });
        
        return new Promise(resolve => setTimeout(() => resolve(summary), MOCK_DELAY));
    },
    
    getPendingDeviationsForBranch: async (branchId: string, weekEnding: string): Promise<PendingDeviation[]> => {
        const branchDeviations = pendingDeviations.filter(p => p.branchId === branchId && p.weekEnding === weekEnding);
        return new Promise(resolve => setTimeout(() => resolve([...branchDeviations]), MOCK_DELAY));
    },

    getClientPortfolioSummary: async (pan: string): Promise<ClientPortfolioSummary> => {
        const clientAccounts = mockClientProfiles.filter(p => p.panPrimary === pan);
        if (clientAccounts.length === 0) throw new Error("Client not found");

        const summary = clientAccounts.reduce((acc, account) => {
            acc.totalPortfolioValue += account.accountBalance;
            acc.totalSetBalance += account.setBalance || 0;
            return acc;
        }, { totalPortfolioValue: 0, totalSetBalance: 0 });

        const netDeviationAmount = summary.totalPortfolioValue - summary.totalSetBalance;
        const netDeviationPercent = summary.totalSetBalance > 0 ? (netDeviationAmount / summary.totalSetBalance) * 100 : 0;

        return new Promise(resolve => setTimeout(() => resolve({
            pan,
            name: clientAccounts[0].nameFirstHolder,
            totalPortfolioValue: summary.totalPortfolioValue,
            totalSetBalance: summary.totalSetBalance,
            netDeviationAmount,
            netDeviationPercent,
        }), MOCK_DELAY / 2));
    },

    getClientActivityFeed: async (pan: string): Promise<ActivityFeedItem[]> => {
        const relatedActivities = activityFeed.filter(act => act.pan === pan);
        return new Promise(resolve => setTimeout(() => resolve(relatedActivities.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())), MOCK_DELAY / 2));
    },

    getKycChangeHistory: async (pan: string): Promise<KycChangeItem[]> => {
        const relatedChanges = kycChangeHistory.filter(c => c.pan === pan);
        return new Promise(resolve => setTimeout(() => resolve(relatedChanges.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())), MOCK_DELAY / 2));
    },
};