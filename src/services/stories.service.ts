import { auth_axios } from "@/api/axios";
import {
  StoriesListResponse,
  Story,
  BulkUpdateResult,
  StoryUpdateData,
} from "@/shared/types/stories.types";

class StoriesService {
  private readonly BASE_URL = "/stories";

  async getStories(
    page = 1,
    pageSize = 20,
    search?: string
  ): Promise<StoriesListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (search && search.trim()) {
      params.append("search", search.trim());
    }

    const { data } = await auth_axios.get<StoriesListResponse>(
      `${this.BASE_URL}?${params.toString()}`
    );
    return data;
  }

  async getStoryById(id: string): Promise<Story | null> {
    try {
      const { data } = await auth_axios.get<Story>(`${this.BASE_URL}/${id}`);
      return data;
    } catch {
      return null;
    }
  }

  async updateStory(id: string, updateData: StoryUpdateData): Promise<boolean> {
    try {
      await auth_axios.put(`${this.BASE_URL}/${id}`, updateData);
      return true;
    } catch {
      return false;
    }
  }

  async bulkUpdateFromFile(file: File): Promise<BulkUpdateResult | null> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await auth_axios.post<BulkUpdateResult>(
        `${this.BASE_URL}/bulk-update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error && "response" in error
          ? // @ts-expect-error safe narrowing for axios-like errors
            (error.response?.data?.detail as string) ||
            "Ошибка при массовом обновлении"
          : "Ошибка при массовом обновлении";
      return {
        success: false,
        message,
        deleted_count: 0,
        added_count: 0,
        error: "UploadError",
      };
    }
  }

  async downloadDump(): Promise<void> {
    try {
      const response = await auth_axios.get(`${this.BASE_URL}/dump`, {
        responseType: "blob",
      });

      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "stories_dump.json");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка при скачивании дампа:", error);
    }
  }
}

export const storiesService = new StoriesService();
