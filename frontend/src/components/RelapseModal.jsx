import React from "react";

const RelapseModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Confirm Relapse</h3>
                <p className="py-4">{message}</p>
                <div className="modal-action">
                    <button onClick={onCancel} className="btn btn-outline">
                        No
                    </button>
                    <button onClick={onConfirm} className="btn btn-error">
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RelapseModal;
