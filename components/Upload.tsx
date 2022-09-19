import React from "react";

type Props = {
  handleOndragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleOndrop: (event: React.DragEvent<HTMLDivElement>) => void;
  fileRef: React.RefObject<HTMLInputElement>;
};

const Upload = ({ fileRef, handleOndrop, handleOndragOver }: Props) => {
  return (
    <div
      onDragOver={handleOndragOver}
      onDrop={handleOndrop}
      onClick={() => fileRef.current?.click()}
      className="border-2 group border-dashed border-slate-200 hover:border-blue-400 transition-colors flex flex-col justify-center items-center p-4 rounded-lg"
    >
      <div className="h-12 text-secondary group-hover:text-blue-400 transition-colors">
        <svg width="100%" height="100%" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M23 18h-3v-3h-2v3h-3v2h3v3h2v-3h3M6 2a2 2 0 0 0-2 2v16c0 1.11.89 2 2 2h7.81c-.36-.62-.61-1.3-.73-2H6V4h7v5h5v4.08c.33-.05.67-.08 1-.08c.34 0 .67.03 1 .08V8l-6-6M8 12v2h8v-2m-8 4v2h5v-2Z"
          ></path>
        </svg>
      </div>
      <h2 className="font-semibold text-primary text-lg group-hover:text-blue-400 transition-colors">
        Select a Image file to upload
      </h2>
      <p className="text-secondary text-sm">or drag and drop it here</p>
    </div>
  );
};

export default Upload;
