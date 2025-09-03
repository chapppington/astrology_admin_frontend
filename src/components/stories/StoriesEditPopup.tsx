"use client";

import * as React from "react";
import { Button } from "@/ui/shadcn/button";
import { Label } from "@/ui/shadcn/label";
import { toast } from "@/ui/shadcn/sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/shadcn/sheet";
import { StoryBlock, StoryUpdateData } from "@/shared/types/stories.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storiesService } from "@/services/stories.service";
import { useEffect, useState } from "react";

export interface StoriesEditPopupProps {
  storyId: string;
  planetRu: string;
  elementRu: string;
  initialStories: StoryBlock[];
  onSaved?: () => void;
}

export default function StoriesEditPopup({
  storyId,
  planetRu,
  elementRu,
  initialStories,
  onSaved,
}: StoriesEditPopupProps) {
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: StoryUpdateData }) =>
      storiesService.updateStory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });
  const [open, setOpen] = useState(false);
  const [editedStories, setEditedStories] =
    useState<StoryBlock[]>(initialStories);

  useEffect(() => {
    if (open) {
      setEditedStories(initialStories);
    }
  }, [open, initialStories]);

  const handleChangeContent = (index: number, value: string) => {
    setEditedStories((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], content: value };
      return copy;
    });
  };

  const handleSave = async () => {
    const result = await updateMutation.mutateAsync({
      id: storyId,
      data: { stories: editedStories },
    });
    if (result) {
      toast.success("Изменения сохранены", {
        description: "Контент историй успешно обновлён.",
      });
      setOpen(false);
      onSaved?.();
    } else {
      toast.error("Не удалось сохранить", {
        description: "Попробуйте ещё раз или проверьте соединение.",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Редактировать
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-3xl">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>
            Редактирование историй для {planetRu} в {elementRu}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6 pb-24 px-4 sm:px-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {editedStories.map((story, index) => (
            <div
              key={story.theme_key}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-lg">{story.theme_ru}</div>
                <div className="text-sm text-muted-foreground">
                  #{story.story_number}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {story.theme_title}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`content-${story.theme_key}`}>Контент</Label>
                <textarea
                  id={`content-${story.theme_key}`}
                  className="w-full min-h-28 rounded-md border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={story.content}
                  onChange={(e) => handleChangeContent(index, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={updateMutation.isPending}
            >
              Отмена
            </Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
