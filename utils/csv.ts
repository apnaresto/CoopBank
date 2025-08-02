
import { ClientProfile } from '../types';

// The headers must match the expected upload format, which corresponds to the ClientProfile keys.
const headers: (keyof Omit<ClientProfile, 'id' | 'weeklyCr' | 'weeklyDr'>)[] = [
    'panPrimary', 'branchId', 'rmId', 'branchManagerId', 'familyGroupId',
    'accountNumber', 'panJoint1', 'panJoint2', 'nameFirstHolder', 'jointName1', 'jointName2',
    'accountType', 'accountCategory', 'address1', 'address2', 'address3', 'address4',
    'city', 'state', 'country', 'pinCode', 'contactMobile', 'contactEmail', 'contactDob',
    'bankName', 'bankAcNo', 'bankIfsc', 'bankMicr', 'accountBalance', 'aaBalPercentage',
    'freeBalance', 'freeBalPercentage', 'pledgeBalance', 'pledgeBalPercentage',
    'pledgeLock', 'lockSBal', 'lockDate', 'freezeZeBal'
];

// Sample data rows that conform to the ClientProfile structure.
const sampleData: Omit<ClientProfile, 'id' | 'weeklyCr' | 'weeklyDr'>[] = [
    {
        panPrimary: 'PANEX1234A', branchId: 'b1', rmId: 'rm1', branchManagerId: 'bm1', familyGroupId: 'fg1',
        accountNumber: '1002003001', panJoint1: null, panJoint2: null, nameFirstHolder: 'Ramesh Kumar', jointName1: null, jointName2: null,
        accountType: 'Urban', accountCategory: 'RT', address1: '123, Main Street', address2: 'Apt 4B', address3: null, address4: null,
        city: 'Mumbai', state: 'Maharashtra', country: 'India', pinCode: '400001', contactMobile: '9988776655', contactEmail: 'ramesh.k@example.com', contactDob: '1980-01-15',
        bankName: 'Sample Bank', bankAcNo: '9876543210', bankIfsc: 'SAMP0000001', bankMicr: '400001001', accountBalance: 500000, aaBalPercentage: 100,
        freeBalance: 500000, freeBalPercentage: 100, pledgeBalance: 0, pledgeBalPercentage: 0, pledgeLock: null, lockSBal: 0, lockDate: null, freezeZeBal: 0
    },
    {
        panPrimary: 'PANEX5678B', branchId: 'b2', rmId: 'rm3', branchManagerId: 'bm2', familyGroupId: null,
        accountNumber: '4005006002', panJoint1: 'PANEX9012C', panJoint2: null, nameFirstHolder: 'Sunita Devi', jointName1: 'Anil Devi', jointName2: null,
        accountType: 'Metro', accountCategory: 'HN', address1: '456, Ring Road', address2: null, address3: null, address4: null,
        city: 'New Delhi', state: 'Delhi', country: 'India', pinCode: '110001', contactMobile: '9876543210', contactEmail: 'sunita.d@example.com', contactDob: '1975-03-22',
        bankName: 'Another Bank', bankAcNo: '1234567890', bankIfsc: 'ANTH0000002', bankMicr: '110002002', accountBalance: 1500000, aaBalPercentage: 100,
        freeBalance: 1500000, freeBalPercentage: 100, pledgeBalance: 0, pledgeBalPercentage: 0, pledgeLock: null, lockSBal: 0, lockDate: null, freezeZeBal: 0
    }
];

/**
 * Escapes a cell value for CSV format. If the value contains a comma, newline, or double quote,
 * it wraps the value in double quotes and escapes any existing double quotes.
 * @param cell The value to escape.
 * @returns The CSV-safe string.
 */
const escapeCsvCell = (cell: any): string => {
    if (cell === null || cell === undefined) {
        return '';
    }
    const str = String(cell);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};

/**
 * Generates a CSV string containing sample client data.
 * @returns A string in CSV format.
 */
export const generateSampleCsv = (): string => {
    const headerRow = headers.join(',');
    const dataRows = sampleData.map(row => {
        return headers.map(header => {
            return escapeCsvCell(row[header as keyof typeof row]);
        }).join(',');
    });

    return [headerRow, ...dataRows].join('\n');
};