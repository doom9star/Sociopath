import { Button } from "antd";

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
            <Button
              type="primary"
              onClick={onSuccess}
              loading={loading}
              className="ml-4"
            >
              Yes
            </Button>
            <Button onClick={onDismiss}>No</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
