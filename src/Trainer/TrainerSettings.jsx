import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TrainerSettings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Trainer
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          Trainer Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile and notification preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">
            Profile details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Full name
              </label>
              <Input placeholder="Trainer name" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Email
              </label>
              <Input type="email" placeholder="trainer@example.com" />
            </div>
          </div>

          <Button>Save profile</Button>
        </Card>

        {/* Notifications */}
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">
            Notifications
          </h2>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" className="accent-primary h-4 w-4" />
            Email alerts for new doubts
          </label>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" className="accent-primary h-4 w-4" />
            Email alerts for new assignments
          </label>

          <Button variant="secondary">Save preferences</Button>
        </Card>
      </div>
    </div>
  );
};

export default TrainerSettings;

