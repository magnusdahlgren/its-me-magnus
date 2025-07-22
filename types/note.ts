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
  order_tagged_by: "index" | "newest" | "oldest";
  sort_index: number;
  created_at: string;
  updated_at: string | null;
  tags: Tag[];
}

export type FormType = {
  title: string | null;
  content: string | null;
  image_url: string | null;
  updated_at: string | null;

  is_important: boolean;
  is_private: boolean;
  use_as_tag: boolean;

  order_tagged_by: "index" | "newest" | "oldest";
  sort_index: number | null;

  tags: string[];
};

export const defaultFormData: FormType = {
  title: null,
  content: null,
  image_url: null,
  updated_at: null,

  is_important: false,
  is_private: false,
  use_as_tag: false,

  order_tagged_by: "oldest",
  sort_index: null,

  tags: [],
};
