"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { detectClientLocale } from "@/lib/i18n/locale";
import { SIGNUP_LOCALE_COOKIE } from "@/lib/i18n/default-categories";
import { createClient } from "@/lib/supabase/client";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: displayName || undefined,
              locale: detectClientLocale(),
            },
          },
        });
        if (error) throw error;
        toast.success(t("accountCreated"));
        router.push("/login");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("somethingWrong"));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleAuth() {
    setLoading(true);
    const signupLocale = detectClientLocale();
    document.cookie = `${SIGNUP_LOCALE_COOKIE}=${signupLocale}; path=/; max-age=3600; SameSite=Lax`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full rounded-xl"
        onClick={handleGoogleAuth}
        disabled={loading}
      >
        {t("continueGoogle")}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">{tCommon("or")}</span>
        </div>
      </div>

      <form onSubmit={handleEmailAuth} className="space-y-4">
        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="displayName">{t("name")}</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t("namePlaceholder")}
              className="h-11 rounded-xl"
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("passwordPlaceholder")}
            className="h-11 rounded-xl"
          />
        </div>
        <Button
          type="submit"
          className="h-11 w-full rounded-xl"
          disabled={loading}
        >
          {mode === "signup" ? t("createAccount") : t("signIn")}
        </Button>
        {mode === "signup" && (
          <p className="text-center text-xs text-muted-foreground">
            {t.rich("privacyAgree", {
              link: (chunks) => (
                <Link href="/privacy" className="text-primary hover:underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        )}
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {mode === "signup" ? (
          <>
            {t("alreadyHaveAccount")}{" "}
            <Link href="/login" className="text-primary hover:underline">
              {t("signIn")}
            </Link>
          </>
        ) : (
          <>
            {t("newHere")}{" "}
            <Link href="/signup" className="text-primary hover:underline">
              {t("createAccount")}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
