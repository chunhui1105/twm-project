import { AdminLayout } from "@/components/admin-layout";
import { useGetContactInfo, useUpdateContactInfo, getGetContactInfoQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, Save, Loader2, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

const ICONS: Record<string, React.ElementType> = {
  address: MapPin,
  phone: Phone,
  email: Mail,
  operating_hours: Clock,
  map_embed_url: Map,
};

export default function AdminContactInfo() {
  const { data, isLoading } = useGetContactInfo();
  const updateMutation = useUpdateContactInfo();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      const map: Record<string, string> = {};
      data.forEach((item) => { map[item.key] = item.value; });
      setValues(map);
    }
  }, [data]);

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      await updateMutation.mutateAsync({ key, data: { value: values[key] ?? "" } });
      await queryClient.invalidateQueries({ queryKey: getGetContactInfoQueryKey() });
      toast({ title: "Saved", description: "Contact info updated." });
    } catch {
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    } finally {
      setSaving(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tighter uppercase mb-1">Contact Info</h1>
        <p className="text-sm text-muted-foreground mb-8">
          These details appear on the public Contact page under "Find Us".
        </p>

        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : (
          <div className="space-y-6">
            {data?.map((item) => {
              const Icon = ICONS[item.key] ?? MapPin;
              const isMultiline = item.key === "operating_hours" || item.key === "address";
              const isMapUrl = item.key === "map_embed_url";
              return (
                <div key={item.key} className="border border-border bg-card p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{item.label}</span>
                  </div>

                  {isMapUrl ? (
                    <>
                      <p className="text-xs text-muted-foreground">
                        Go to <strong>Google Maps</strong> → find your location → Share → Embed a map → copy the <code className="bg-secondary px-1 py-0.5 rounded text-xs">src="..."</code> URL and paste it below.
                      </p>
                      <input
                        type="url"
                        value={values[item.key] ?? ""}
                        onChange={(e) => setValues((v) => ({ ...v, [item.key]: e.target.value }))}
                        placeholder="https://www.google.com/maps/embed?pb=..."
                        className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-primary font-mono"
                      />
                      {values[item.key] && (
                        <div className="border border-border overflow-hidden">
                          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground px-3 py-2 border-b border-border bg-secondary">Preview</p>
                          <iframe
                            src={values[item.key]}
                            width="100%"
                            height="220"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      )}
                    </>
                  ) : isMultiline ? (
                    <textarea
                      rows={3}
                      value={values[item.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [item.key]: e.target.value }))}
                      className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-primary resize-none font-sans"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[item.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [item.key]: e.target.value }))}
                      className="w-full bg-background border border-border p-3 text-sm focus:outline-none focus:border-primary"
                    />
                  )}

                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => handleSave(item.key)}
                      disabled={saving === item.key}
                      className="gap-2"
                    >
                      {saving === item.key ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      Save
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
