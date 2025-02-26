import React from "react";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Confirm Delete</h3>
                <p className="py-4">{message}</p>
                <div className="modal-action">
                    <button onClick={onCancel} className="btn btn-outline">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="btn btn-error">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
