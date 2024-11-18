import classNames from "classnames";
import React, { useState } from "react";
import { Tooltip } from "react-tooltip";

interface Props {
  icon?: string;
  iconPosition?: "left" | "right";
  inputProps?: object;
  error?: string;
}

function Input(props: Props) {
  const [showTooltip, setShowToolTip] = useState(false);
  const errorRef = React.useRef<HTMLElement | null>(null);

  return (
    <div className="flex flex-col mb-2">
      <div className="flex relative">
        {props.icon &&
          (!props.iconPosition || props.iconPosition === "left") && (
            <span className="inline-flex  items-center px-3 border bg-white border-gray-300 text-gray-500 shadow-sm text-sm">
              <i className={props.icon}></i>
            </span>
          )}
        <input
          type="text"
          className={
            "flex-1 border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none" +
            classNames({ " pr-10": props.error })
          }
          {...props.inputProps}
          autoComplete="off"
        />
        {props.error && (
          <Tooltip content={props.error} isOpen={showTooltip} place="top">
            <i
              ref={errorRef}
              className="fas fa-exclamation-triangle text-red-700 absolute right-3 top-3"
              onMouseEnter={() => {
                setShowToolTip(true);
              }}
              onMouseLeave={() => {
                setShowToolTip(false);
              }}
            />
          </Tooltip>
        )}
        {props.icon && props.iconPosition === "right" && (
          <span className="inline-flex  items-center px-3 border bg-white border-gray-300 text-gray-500 shadow-sm text-sm">
            <i className={props.icon}></i>
          </span>
        )}
      </div>
    </div>
  );
}

export default Input;
