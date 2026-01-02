export type UserType = "personal" | "business";

export type User = {
  id: number;
  email: string;
  password_hash: string;
  user_type: UserType;
  first_name?: string;
  last_name?: string;
  business_name?: string;
  business_description?: string;
  created_at: Date;
  updated_at: Date;
};
