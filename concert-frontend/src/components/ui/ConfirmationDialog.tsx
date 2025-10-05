"use client";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmationDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false }: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${isDestructive ? "bg-red-100" : "bg-blue-100"}`}>
              <span className={`text-2xl ${isDestructive ? "text-red-600" : "text-blue-600"}`}>{isDestructive ? "⚠️" : "ℹ️"}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>

          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex justify-end space-x-3">
            <button onClick={onCancel} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              {cancelText}
            </button>
            <button onClick={onConfirm} className={`px-4 py-2 text-white rounded-lg transition-colors ${isDestructive ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
