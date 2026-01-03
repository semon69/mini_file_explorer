"use client";

import { useState } from "react";
import { Edit2, Save, X } from "lucide-react";
import { filesAPI } from "@/lib/api";

interface FileContentProps {
  item: any;
  onSelectItem: any;
  onRefresh: () => void;
}

export default function FileContent({ item, onSelectItem, onRefresh }: FileContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(item.content || "");

  const handleSave = async () => {
    try {
      // const response = await fetch(`http://localhost:5000/api/files/${item._id}/content`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ content }),
      // })

      const data: any = await filesAPI.updateFileContent(item._id, content);

      if (data._id) {
        setIsEditing(false);
        onRefresh();
      }
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  if (item.type === "image") {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full">
        <img
          src={`data:${item.mimeType};base64,${item.content}`}
          alt={item.name}
          className="max-w-2xl max-h-96 object-contain rounded"
        />
        <p className="text-sm text-gray-500 mt-4">{item.name}</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">{item.name}</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-medium transition"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setContent(item.content || "");
                }}
                className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded font-medium transition"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded font-medium transition"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 p-4 border border-gray-300 rounded font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <pre className="flex-1 p-4 bg-gray-50 rounded border border-gray-200 overflow-auto font-mono text-sm text-gray-700">
          {content || "No content"}
        </pre>
      )}
    </div>
  );
}
