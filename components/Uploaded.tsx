import React from "react";
import { copyToClipboard } from "../utils/copyToClipboard";

type Props = {
  url: string | undefined;
};

const Uploaded = ({ url }: Props) => {
  return (
    <div className="relative w-full group border-dashed border-slate-200 hover:border-blue-400 transition-colors flex flex-col justify-center items-center  rounded-lg">
      <img src={url} alt="uploaded image" className="rounded-lg" />
      <div className="w-full flex items-center p-1 border border-slate-200 rounded-lg mt-2">
        <p className="text-ellipsis whitespace-nowrap overflow-hidden ml-1">
          {url}{" "}
        </p>
        <button
          type="button"
          onClick={() => copyToClipboard(url)}
          className="bg-blue-400 px-4 py-2 rounded-lg text-white font-medium hover:bg-blue-500 transition-colors"
        >
          Copy
        </button>
      </div>
    </div>
  );
};

export default Uploaded;
