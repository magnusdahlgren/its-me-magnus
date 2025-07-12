import { Tag } from "./tag";

export interface Note {
  id: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  image_caption: string | null;
  created_at: string;
  updated_at: string;
  is_tag?: boolean;
  tags: Tag[];
}
