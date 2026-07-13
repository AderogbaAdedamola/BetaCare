import { useState } from "react";
import { Copy, RefreshCw, Key, Webhook } from "lucide-react";
import { toast } from "sonner";

export function IntegrationForm() {
  const [apiKey, setApiKey] = useState("bc_test_8f9a2b3c4d5e6f7g8h9i0j");
  const [webhookUrl, setWebhookUrl] = useState("https://hospital-system.local/api/betacare/webhook");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API Key copied to clipboard");
  };

  const regenerateKey = () => {
    setApiKey(`bc_live_${Math.random().toString(36).substring(2, 15)}`);
    toast.success("New API Key generated");
  };

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Integration settings saved successfully");
  };

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Key size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">API Access</h3>
            <p className="text-sm text-muted-foreground">Manage your hospital's API key for BetaCare integration.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Live API Key</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={apiKey}
                className="flex-1 bg-muted/50 border border-border text-foreground text-sm rounded-lg p-2.5 outline-none font-mono"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Copy size={16} /> Copy
              </button>
              <button
                type="button"
                onClick={regenerateKey}
                className="px-4 py-2 border border-destructive/20 text-destructive rounded-lg text-sm font-medium hover:bg-destructive/10 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={16} /> Rotate
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Keep this key secure. Rotating it will invalidate the previous key immediately.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Webhook size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Webhook Configuration</h3>
            <p className="text-sm text-muted-foreground">Receive real-time updates when patients grant or revoke consent.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="webhook" className="block text-sm font-semibold text-foreground mb-1.5">Webhook URL</label>
            <input
              id="webhook"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-domain.com/webhook"
              className="w-full bg-background border border-border text-foreground text-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-primary block p-2.5 outline-none transition-all"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
