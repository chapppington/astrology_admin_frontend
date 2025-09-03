"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps, toast } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--success-text": "var(--foreground)",
          "--error-text": "var(--foreground)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "bg-popover border text-neutral-900 dark:text-neutral-100",
          title: "!text-neutral-900 dark:!text-neutral-100 font-bold",
          description: "!text-neutral-900 dark:!text-neutral-100",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
