export interface StoryBlock {
  theme_key: string;
  theme_title: string;
  theme_ru: string;
  story_number: number;
  content: string;
}

export interface Story {
  _id: string;
  planet: string;
  planet_ru: string;
  element: string;
  element_ru: string;
  element_type: string;
  stories: StoryBlock[];
}

export interface StoriesListResponse {
  items: Story[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface BulkUpdateResult {
  success: boolean;
  message: string;
  deleted_count: string | number;
  added_count: number;
  error?: string;
}

export interface StoryUpdateData {
  planet?: string;
  planet_ru?: string;
  element?: string;
  element_ru?: string;
  element_type?: string;
  stories?: StoryBlock[];
}
