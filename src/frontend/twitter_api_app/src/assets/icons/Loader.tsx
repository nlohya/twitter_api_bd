import * as React from "react";

type LoaderProps = {
  width: number;
  height: number;
};

const Loader = (props: LoaderProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width}
    height={props.height}
    className={"duration-300"}
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path
      fill="#fff"
      d="M18.364 5.636 16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z"
    />
  </svg>
);

export default Loader;
