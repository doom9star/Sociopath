import classNames from "classnames";

interface Props {
  label: string;
  buttonProps?: object;
  styles?: string;
  loading?: boolean;
  spinnerStyle?: string;
  icon?: JSX.Element;
}

function Button(props: Props) {
  return (
    <button
      type="button"
      className={
        "relative py-2 px-4 w-full transition ease-in duration-200 text-center font-bold text-sm rounded-lg outline-none " +
        classNames({
          [props.styles || ""]: props.styles,
          "opacity-60": props.loading,
        })
      }
      disabled={props.loading}
      {...props.buttonProps}
    >
      {props.icon}
      {props.label}
      {props.loading && (
        <div
          className={
            "w-5 h-5 border-2 border-white rounded-full absolute border-b-0 animate-spin " +
            classNames({
              [props.spinnerStyle!]: props.spinnerStyle,
            })
          }
          style={{ top: "25%", left: "45%" }}
        ></div>
      )}
    </button>
  );
}

export default Button;
