import { useNavigate } from "react-router-dom";
import Button from "./custom/Button";

function BackButton() {
  const navigate = useNavigate();
  return (
    <div className="self-start">
      <Button
        label=""
        styles="text-purple-700 border mb-2 border-purple-700 hover:opacity-80"
        icon={<i className="fas fa-chevron-left text-purple-600" />}
        buttonProps={{
          onClick: () => navigate(-1),
        }}
      />
    </div>
  );
}

export default BackButton;
