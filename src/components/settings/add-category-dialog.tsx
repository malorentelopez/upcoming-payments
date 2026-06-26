"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory } from "@/lib/actions/payments";

export function AddCategoryDialog() {
  const router = useRouter();
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const tAuth = useTranslations("auth");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await createCategory(formData);
        toast.success(t("categoryAdded"));
        setOpen(false);
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : tAuth("somethingWrong"),
        );
      }
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-9 rounded-xl"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4" />
        {t("addCategory")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-5 rounded-2xl p-6 sm:max-w-md [&_[data-slot=dialog-close]]:top-4 [&_[data-slot=dialog-close]]:right-4">
          <DialogHeader className="pr-6">
            <DialogTitle>{t("addCategoryTitle")}</DialogTitle>
            <DialogDescription>{t("addCategoryDescription")}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="category-name">{t("categoryNamePlaceholder")}</Label>
              <Input
                id="category-name"
                name="name"
                required
                placeholder={t("categoryNamePlaceholder")}
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-color">{t("categoryColor")}</Label>
              <Input
                id="category-color"
                name="color"
                type="color"
                defaultValue="#6366f1"
                className="h-11 w-full rounded-xl p-1.5"
              />
            </div>

            <input type="hidden" name="icon" value="circle" />

            <DialogFooter className="mx-0 mb-0 flex-row justify-end gap-3 border-t-0 bg-transparent p-0 pt-2">
              <Button
                type="button"
                variant="outline"
                className="h-11 min-w-24 rounded-xl"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                {tCommon("cancel")}
              </Button>
              <Button
                type="submit"
                className="h-11 min-w-24 rounded-xl"
                disabled={isPending}
              >
                {tCommon("add")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
