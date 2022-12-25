import React from "react";

interface Props {
  title: string;
  description: string;
  onDismiss: () => void;
  onSuccess: () => void;
  loading?: boolean;
}

function Modal({ title, description, onDismiss, onSuccess, loading }: Props) {
  return (
    <div
      className="fixed z-10"
      style={{ left: "40%", top: "30%" }}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center pt-4 px-4 pb-20 text-center">
        <div
          className="fixed inset-0 bg-gray-200 opacity-50 transition-opacity"
          aria-hidden="true"
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all">
          <div className="bg-white px-4 pt-5 pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
                <i className={`fas fa-fan h-4 w-4 text-purple-500`}></i>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg text-gray-800 font-medium"
                  id="modal-title"
                >
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-700 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onSuccess}
            >
              {loading ? (
                <div className="w-5 h-5 border border-gray-200 border-b-0 rounded-full animate-spin" />
              ) : (
                <>Yes</>
              )}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onDismiss}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
