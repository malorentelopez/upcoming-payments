"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory, deleteCategory } from "@/lib/actions/payments";
import type { Category } from "@/lib/types";

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const router = useRouter();

  async function handleDeleteCategory(id: string) {
    const result = await deleteCategory(id);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Category removed");
      router.refresh();
    }
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5">
      <h2 className="mb-4 font-medium">Categories</h2>
      <ul className="mb-4 space-y-2">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2"
          >
            <span className="flex items-center gap-2 text-sm">
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: cat.color }}
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
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <form action={createCategory} className="flex flex-col gap-3 sm:flex-row">
        <Input
          name="name"
          placeholder="Category name"
          required
          className="h-11 flex-1 rounded-xl"
        />
        <Input
          name="color"
          type="color"
          defaultValue="#6366f1"
          className="h-11 w-16 rounded-xl p-1"
        />
        <input type="hidden" name="icon" value="circle" />
        <Button type="submit" variant="outline" className="h-11 rounded-xl">
          Add
        </Button>
      </form>
    </section>
  );
}
