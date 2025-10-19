
export interface Category {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  categoryId: string;
  icon?: string;
}

export interface Entry {
  id:string;
  name: string;
  definition: string;
  context: string;
  groupId: string | null;
  tags: string[];
  createdAt: number;
  isFavorite?: boolean;
}

export interface CategoryExportData {
  category: Category;
  groups: Group[];
  entries: Entry[];
}