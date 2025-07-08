import { Tag } from "./tag";

export interface Note {
  id: string;
  title?: string;
  content?: string;
  image_url?: string;
  image_caption?: string;
  created_at: string;
  updated_at: string;
  is_tag?: boolean;
  tags: Tag[];
}
