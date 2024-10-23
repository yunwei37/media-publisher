import { Button } from "@vercel/examples-ui";

interface MediaKeyTableProps {
    mediaKeys: Record<string, string>;
    onDelete: (key: string) => Promise<void>;
  }
  
  export function MediaKeyTable({ mediaKeys, onDelete }: MediaKeyTableProps) {
    if (Object.entries(mediaKeys).length === 0) {
      return (
        <div className="p-4 text-gray-500">
          No media keys found
        </div>
      );
    }
  
    return (
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Key</th>
            <th className="px-4 py-2 text-left">Value</th>
            <th className="px-4 py-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(mediaKeys).map(([mediaKey, value]) => (
            <tr key={mediaKey} className="border-t">
              <td className="px-4 py-2 break-all">{mediaKey}</td>
              <td className="px-4 py-2 break-all">{value}</td>
              <td className="px-4 py-2 text-right">
                <Button
                  variant="secondary"
                  onClick={() => onDelete(mediaKey)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
