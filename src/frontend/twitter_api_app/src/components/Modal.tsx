import React, { ReactNode } from "react";

type ModalProps = {
  title?: string;
  modalState: boolean;
  close: Function;
  children?: ReactNode;
};

const Modal = (props: ModalProps) => {
  const { title, modalState, close, children } = props;

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 backdrop-blur-sm transition-modal ${
        modalState ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
      }`}
    >
      <div
        className={`absolute min-w-fit top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-twitter border-2 rounded-lg border-twitter-blue transition-modal ${
          modalState ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
        }`}
      >
        <div
          className="w-full p-2 text-right text-white bg-twitter-blue hover:cursor-pointer flex items-center justify-between gap-4"
          onClick={() => {
            close();
          }}
        >
          <p className="whitespace-nowrap">{title}</p>
          <span className="w-6 h-6 flex items-center justify-center bg-white text-twitter-blue rounded-full">
            X
          </span>
        </div>

        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
