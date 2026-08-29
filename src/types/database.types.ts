export type UserRole = 'Farmer' | 'Labour' | 'EquipmentOwner' | 'Dealer' | 'Admin';
export type AppLanguage = 'en' | 'mr' | 'hi';

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  role: UserRole;
  preferredLanguage: AppLanguage;
  avatarUrl?: string;
  locationAddress: string;
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
  isVerified: boolean;
  createdAt?: string;
}

export interface FarmerProfile extends UserProfile {
  farmSizeAcres: number;
  farmingType: string;
  primaryCrops: string[];
  irrigationSource?: string;
}

export interface LabourerProfile extends UserProfile {
  skills: string[];
  workCategories: string[];
  experienceYears: number;
  hourlyRate: number;
  dailyRate: number;
  workingRadiusKm: number;
  availabilityStatus: 'Available' | 'Busy' | 'Unavailable';
  ratingAvg: number;
  ratingCount: number;
}

export interface EquipmentOwnerProfile extends UserProfile {
  businessName?: string;
  totalListings: number;
  rtoVerified: boolean;
}

export interface DealerProfile extends UserProfile {
  dealershipName: string;
  gstNumber?: string;
  authorizedBrands: string[];
  ratingAvg: number;
}

export interface EquipmentListing {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  title: string;
  equipmentType: 'Tractor' | 'Harvester' | 'Rotavator' | 'SeedDrill' | 'Sprayer' | 'Thresher';
  brand: string;
  model: string;
  yearOfMfg: number;
  horsepower: number;
  capacitySpec: string;
  dailyRentPrice: number;
  hourlyRentPrice?: number;
  locationName: string;
  latitude: number;
  longitude: number;
  availabilityStatus: 'Available' | 'Rented' | 'Maintenance';
  condition: 'Excellent' | 'Good' | 'Fair';
  imageUrl: string;
  gallery: string[];
  videoUrl?: string;
  
  // RTO Information
  rtoRegNumber?: string;
  rtoOffice?: string;
  rtoValidityDate?: string;
  rtoVerificationStatus: 'Pending' | 'Submitted' | 'Verified' | 'Failed';
  
  // Maintenance & Rating
  lastServiceDate?: string;
  maintenanceSummary?: string;
  ratingAvg: number;
  ratingCount: number;
}

export interface MaintenanceLog {
  id: string;
  equipmentId: string;
  serviceDate: string;
  maintenanceType: string;
  cost: number;
  serviceProvider: string;
  notes: string;
  nextServiceDue: string;
}

export interface DealerProduct {
  id: string;
  dealerId: string;
  dealerName: string;
  dealerPhone: string;
  title: string;
  category: string;
  brand: string;
  model: string;
  salePrice: number;
  horsepower?: number;
  specifications: Record<string, string>;
  imageUrl: string;
  inStock: boolean;
  warrantyYears: number;
}

export interface Booking {
  id: string;
  bookingCode: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  providerId: string;
  providerName: string;
  providerPhone: string;
  bookingType: 'Labour' | 'EquipmentRental' | 'DealerPurchase';
  targetId: string;
  title: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  locationAddress: string;
  totalAmount: number;
  status: 'Requested' | 'Pending' | 'Accepted' | 'Rejected' | 'PaymentPending' | 'Confirmed' | 'InProgress' | 'Completed' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Refunded' | 'Failed';
  createdAt: string;
}

export interface ActivityHistoryItem {
  id: string;
  userId: string;
  category: 'Labour' | 'Equipment' | 'Purchases' | 'Payments' | 'Bookings' | 'System';
  title: string;
  description: string;
  amount?: number;
  status: string;
  referenceId?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderRole: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface ChatConversation {
  chatId: string;
  peerName: string;
  peerPhone: string;
  peerRole: string;
  lastMsg: string;
  time: string;
  messages: { sender: string; text: string; time: string }[];
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  equipmentId?: string;
  equipmentTitle?: string;
  documentType: 'RTO RC Book' | 'Aadhaar Card' | 'Driving License';
  registrationNumber: string;
  documentUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  adminNotes?: string;
}
