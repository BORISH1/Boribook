export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: string;
  seller_id: string;
  title: string;
  author: string;
  description: string | null;
  price: number;
  condition: 'New' | 'Used';
  category: string;
  image_url: string | null;
  is_for_rent: boolean;
  rent_duration: string | null;
  is_sold: boolean;
  created_at: string;
  updated_at: string;
  seller?: Profile;
}

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  book_id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_price: number;
  created_at: string;
  updated_at: string;
  book?: Book;
  buyer?: Profile;
  seller?: Profile;
}

export interface Chat {
  id: string;
  buyer_id: string;
  seller_id: string;
  book_id: string;
  created_at: string;
  book?: Book;
  buyer?: Profile;
  seller?: Profile;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  is_seen: boolean;
  created_at: string;
}
