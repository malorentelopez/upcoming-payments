"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { deleteAccount } from "@/lib/actions/account";
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

interface DeleteAccountDialogProps {
  email: string;
}

export function DeleteAccountDialog({ email }: DeleteAccountDialogProps) {
  const t = useTranslations("profile");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAccount(confirmEmail);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      router.push("/");
      router.refresh();
    });
  }

  return (
    <section className="rounded-2xl border border-destructive/30 bg-card p-5">
      <h2 className="mb-2 font-medium text-destructive">{t("deleteAccountTitle")}</h2>
      <p className="mb-4 text-sm text-muted-foreground">{t("deleteAccountDesc")}</p>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setConfirmEmail("");
        }}
      >
      <Button
        type="button"
        variant="destructive"
        className="h-11 rounded-xl"
        onClick={() => setOpen(true)}
      >
        {t("deleteAccount")}
      </Button>
      <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t("deleteAccountConfirmTitle")}</DialogTitle>
            <DialogDescription>{t("deleteAccountConfirmDesc")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="confirmEmail">{t("deleteAccountEmailLabel")}</Label>
            <Input
              id="confirmEmail"
              type="email"
              value={confirmEmail}
              onChange={(event) => setConfirmEmail(event.target.value)}
              placeholder={email}
              className="h-11 rounded-xl"
              autoComplete="off"
            />
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              type="button"
              variant="destructive"
              className="h-11 w-full rounded-xl"
              disabled={isPending || confirmEmail.trim().length === 0}
              onClick={handleDelete}
            >
              {t("deleteAccountPermanently")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-xl"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              {t("deleteAccountCancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
