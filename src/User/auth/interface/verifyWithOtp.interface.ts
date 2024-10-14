export interface VerifyWithOtpUser {
  phone: string;
  roles: string[];
  firstName: string;
  lastName: string;
  email: string;
  profilePic?: string;
  createdAt: Date;
  lastLogin: Date;
}
