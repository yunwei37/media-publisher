import { Button } from "@vercel/examples-ui";

interface MediaKeyFormProps {
    onSubmit: (e: React.FormEvent) => Promise<void>;
    newKey: string;
    setNewKey: (value: string) => void;
    newValue: string;
    setNewValue: (value: string) => void;
    loading: boolean;
  }
  
  export function MediaKeyForm({ onSubmit, newKey, setNewKey, newValue, setNewValue, loading }: MediaKeyFormProps) {
    return (
      <form onSubmit={onSubmit} className="mb-4">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Key name"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="flex-1 p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Key value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="flex-1 p-2 border rounded"
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Add Media Key'}
          </Button>
        </div>
      </form>
    );
  }
  