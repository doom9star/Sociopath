import classNames from "classnames";
import React from "react";
import { Link } from "react-router-dom";

type Props = {
  styles?: string;
};

const Logo: React.FC<Props> = ({ styles }) => {
  return (
    <Link to="/">
      <img
        src="/logo.png"
        className={
          "w-56 mx-auto object-contain cursor-pointer " +
          classNames({ [`${styles}`]: !!styles })
        }
        alt="Logo"
      />
    </Link>
  );
};

export default Logo;
