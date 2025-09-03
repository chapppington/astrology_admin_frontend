"use client";

import { useState } from "react";
import { useStories } from "@/hooks/use-stories";
import { StoriesDataTable } from "@/components/stories/StoriesDataTable";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Label } from "@/ui/shadcn/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/shadcn/card";
import { Upload, Download } from "lucide-react";
import { toast } from "sonner";

export function StoriesPageClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    bulkUpdateAsync,
    downloadDump,
    bulkUpdateLoading,
    downloadDumpLoading,
    refetch,
  } = useStories(1, 20);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
    } else {
      toast.error("Пожалуйста, выберите JSON файл");
    }
  };

  const handleBulkUpdate = async () => {
    if (!selectedFile) {
      toast.error("Пожалуйста, выберите файл");
      return;
    }

    try {
      const result = await bulkUpdateAsync(selectedFile);
      if (result && result.success) {
        toast.success(`Успешно обновлено ${result.added_count} записей`);
        setSelectedFile(null);
        const fileInput = document.getElementById(
          "file-upload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        toast.error(result?.message || "Ошибка при обновлении");
      }
    } catch {
      toast.error("Произошла ошибка при обновлении");
    }
  };

  const handleDownloadDump = async () => {
    try {
      await downloadDump();
      toast.success("Дамп успешно скачан");
    } catch {
      toast.error("Ошибка при скачивании дампа");
    }
  };

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Истории</h1>
          <p className="text-muted-foreground">
            Управление астрологическими историями
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleDownloadDump}
            disabled={downloadDumpLoading}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Скачать дамп
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Массовое обновление</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-full sm:flex-1">
              <Label htmlFor="file-upload">Выберите JSON файл</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleBulkUpdate}
              disabled={!selectedFile || bulkUpdateLoading}
              className="w-full sm:w-auto"
            >
              <Upload className="h-4 w-4 mr-2" />
              {bulkUpdateLoading ? "Обновление..." : "Обновить"}
            </Button>
          </div>
          {selectedFile && (
            <p className="text-sm text-muted-foreground mt-2">
              Выбран файл: {selectedFile.name}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify_between">
            <CardTitle>Список историй</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <StoriesDataTable
            onRefresh={refetch}
            isBulkUpdating={bulkUpdateLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
