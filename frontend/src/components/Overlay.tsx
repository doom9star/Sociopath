import React from "react";

type Props = {
  children: any;
  onClick: () => void;
};

const Overlay: React.FC<Props> = ({ children, onClick }) => {
  React.useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, []);
  return (
    <div
      className="fixed w-full h-full z-10"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
      onClick={() => {
        onClick();
      }}
    >
      {children}
    </div>
  );
};

export default Overlay;
