import { Tag } from "./tag";

export interface Note {
  id: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  has_children: boolean;
  is_important: boolean;
  is_private: boolean;
  use_as_tag: boolean;
  sort_index: number;
  created_at: string;
  updated_at: string | null;
  tags: Tag[];
}

export type FormType = {
  title: string | null;
  content: string | null;
  image_url: string | null;
  is_important: boolean;
  is_private: boolean;
  use_as_tag: boolean;
  sort_index: number | null;
  tags?: string[];
};
