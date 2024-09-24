export interface VerifyWithOtpUser {
  phone: string;
  roles: string[];
  firstName: string;
  lastName: string;
  email: string;
  imageUrl?: string;
  createdAt: Date;
  lastLogin: Date;
}
