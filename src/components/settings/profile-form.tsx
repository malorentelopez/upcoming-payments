import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/lib/actions/payments";
import type { Profile } from "@/lib/types";

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "MXN"];

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5">
      <h2 className="mb-4 font-medium">Profile</h2>
      <form action={updateProfile} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display name</Label>
          <Input
            id="displayName"
            name="displayName"
            defaultValue={profile.display_name ?? ""}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="defaultCurrency">Default currency</Label>
          <select
            id="defaultCurrency"
            name="defaultCurrency"
            defaultValue={profile.default_currency}
            className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input
            id="timezone"
            name="timezone"
            defaultValue={profile.timezone}
            className="h-11 rounded-xl"
          />
        </div>
        <Button type="submit" className="h-11 rounded-xl">
          Save profile
        </Button>
      </form>
    </section>
  );
}
