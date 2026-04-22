import { therapist } from "@/lib/mock";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BUSINESS_EMAIL, BUSINESS_PHONE, WHATSAPP_DISPLAY } from "@/lib/constants";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="font-display text-3xl font-medium">Settings</h1>
        <p className="text-sm text-ink-2">Your profile, notification preferences, and AI summary preferences.</p>
      </header>

      <section className="space-y-4 rounded-xl border border-line bg-cream p-6 md:p-8">
        <h2 className="font-display text-lg">Profile</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Full name" defaultValue={therapist.name} />
          <Input label="Role / title" defaultValue={therapist.role} />
          <Input label="Email" type="email" defaultValue={therapist.email} />
          <Input label="Centre phone" type="tel" defaultValue={BUSINESS_PHONE} />
          <Input label="WhatsApp (display)" defaultValue={WHATSAPP_DISPLAY} className="md:col-span-2" />
          <Input label="Public contact email" type="email" defaultValue={BUSINESS_EMAIL} className="md:col-span-2" />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-line bg-cream p-6 md:p-8">
        <h2 className="font-display text-lg">Notifications</h2>
        <ToggleRow
          title="Email me when a new enquiry arrives"
          detail="A short summary with a one-click link to the enquiry."
          defaultChecked
        />
        <ToggleRow
          title="Email me a weekly round-up on Monday morning"
          detail="New clients this week, sessions logged, reports still in draft."
        />
        <ToggleRow
          title="Ping me if a client hasn't had a session in 14 days"
          detail="Gentle nudge, not a blocker."
        />
      </section>

      <section className="space-y-4 rounded-xl border border-line bg-cream p-6 md:p-8">
        <h2 className="font-display text-lg">AI summary preferences</h2>
        <ToggleRow
          title="Auto-generate a 'since last session' summary after each logged session"
          detail="Runs in the background; you'll see a 'Generated — therapist to review' banner until you approve it."
          defaultChecked
        />
        <ToggleRow
          title="Include engagement scores in the summary inputs"
          detail="Without this the model works from observations only."
          defaultChecked
        />
        <div className="rounded-md border border-line bg-cream-2/40 p-3 text-xs text-ink-2">
          Parent-facing drafts always go through the editor. This panel never sends anything to a parent automatically.
        </div>
      </section>

      <div className="flex justify-end">
        <Button variant="primary" size="md">
          Save changes
        </Button>
      </div>
    </div>
  );
}

function ToggleRow({
  title,
  detail,
  defaultChecked,
}: {
  title: string;
  detail: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-md border border-line bg-cream-2/30 p-4">
      <div>
        <div className="text-sm font-medium text-ink">{title}</div>
        <div className="mt-0.5 text-xs text-ink-3">{detail}</div>
      </div>
      <input type="checkbox" defaultChecked={defaultChecked} className="mt-1 h-4 w-4 accent-[#2F5D3A]" />
    </label>
  );
}
