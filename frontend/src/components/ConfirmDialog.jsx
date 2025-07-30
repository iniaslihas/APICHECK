import React from "react";

export default function ConfirmDialog({
                                          open,
                                          title = "Confirm",
                                          message = "Are you sure?",
                                          onConfirm,
                                          onCancel,
                                      }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-700 mb-4">{message}</p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}