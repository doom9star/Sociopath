import classNames from "classnames";
import React from "react";
import { Link } from "react-router-dom";
import { v4 } from "uuid";

interface Props {
  items: { name: string; to: string }[];
}

const BreadCrumb: React.FC<Props> = ({ items }) => {
  return (
    <nav className="rounded w-full">
      <ol className="list-reset flex p-6 font-bold justify-end">
        {items.map((item, idx) => (
          <React.Fragment key={v4()}>
            {idx > 0 && (
              <i className="fas fa-chevron-right mx-4 text-gray-300"></i>
            )}
            <Link
              to={item.to}
              className={
                `text-xs flex items-center` +
                classNames({
                  " text-gray-600": idx === items.length - 1,
                  " text-gray-400": idx !== items.length - 1,
                })
              }
            >
              <i className="fas fa-link mr-2"></i>
              <span
                className={classNames({
                  " underline": idx === items.length - 1,
                })}
              >
                {item.name[0].toUpperCase() + item.name.slice(1)}
              </span>
            </Link>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
