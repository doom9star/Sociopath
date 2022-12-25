import React from "react";
import { useHistory } from "react-router-dom";
import Button from "./custom/Button";

function BackButton() {
  const history = useHistory();
  return (
    <div className="self-start">
      <Button
        label=""
        styles="text-purple-700 border mb-2 border-purple-700 hover:opacity-80"
        icon={<i className="fas fa-chevron-left text-purple-600" />}
        buttonProps={{
          onClick: history.goBack,
        }}
      />
    </div>
  );
}

export default BackButton;
