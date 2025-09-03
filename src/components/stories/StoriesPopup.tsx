"use client";

import * as React from "react";
import { Badge } from "@/ui/shadcn/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/shadcn/sheet";
import { StoryBlock } from "@/shared/types/stories.types";

export interface StoriesPopupProps {
  planetRu: string;
  elementRu: string;
  stories: StoryBlock[];
}

export function StoriesPopup({
  planetRu,
  elementRu,
  stories,
}: StoriesPopupProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Badge
          variant="default"
          className="cursor-pointer hover:bg-primary/80 transition-colors flex items-center gap-1"
        >
          <span>Смотреть {stories.length}</span>
          <span className="text-xs">📖</span>
        </Badge>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>
            Истории для {planetRu} в {elementRu}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6 pb-6 px-4 sm:px-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {stories.map((story) => (
            <div key={story.theme_key} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{story.theme_ru}</h3>
                <Badge variant="outline">#{story.story_number}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {story.theme_title}
              </p>
              <p className="text-sm leading-relaxed">{story.content}</p>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default StoriesPopup;
