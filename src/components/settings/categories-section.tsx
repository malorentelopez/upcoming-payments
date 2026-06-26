"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { AddCategoryDialog } from "@/components/settings/add-category-dialog";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/lib/actions/payments";
import { sanitizeHexColor } from "@/lib/security/colors";
import type { CategoryView } from "@/lib/types";

interface CategoriesSectionProps {
  categories: CategoryView[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const router = useRouter();
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");

  async function handleDeleteCategory(id: string) {
    const result = await deleteCategory(id);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(t("categoryRemoved"));
      router.refresh();
    }
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-medium">{t("categories")}</h2>
        <AddCategoryDialog />
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noCategories")}</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2"
            >
              <span className="flex items-center gap-2 text-sm">
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: sanitizeHexColor(cat.color) }}
                />
                {cat.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => handleDeleteCategory(cat.id)}
              >
                {tCommon("remove")}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
