import React from "react";
// Components
import Loader from "./Loader";

type Props = {
  progress: number;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
};

const Uploading = ({ progress, setFile }: Props) => {
  return (
    <div className="border-2 group border-dashed border-slate-200  flex flex-col justify-center items-center p-4 rounded-lg">
      <Loader percentage={progress} />
      <p className="font-bold text-lg">uploading file...</p>
      <button
        type="button"
        onClick={() => setFile(undefined)}
        className="border border-gray-200 rounded-lg px-4 py-1 font-medium mt-2"
      >
        Cancel
      </button>
    </div>
  );
};

export default Uploading;
