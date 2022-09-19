import React, { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import axios from "axios";
import { copyToClipboard } from "../utils/copyToClipboard";

const Uploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null); // to open file explorer on click
  const [file, setFile] = useState<File>(); // manage the file to upload
  const [state, setState] = useState<"upload" | "uploading" | "uploaded">(
    "upload" // manage state of the upload
  );
  const [imageUrl, setImageUrl] = useState<string>(); // when image uploaded set the url
  const [progress, setProgress] = useState<number>(0); // manage the percentage of the upload

  // manage when a file is selected
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files !== null) {
      // if there is a file
      const file = e.target.files[0];
      setFile(file);
    }
  }

  // manage upload and cancel upload
  useEffect(() => {
    const controller = new AbortController();
    if (file) {
      handleSubmit(file, controller);
    }
    return () => controller.abort();
  }, [file]);

  const handleSubmit = async (
    file: File | undefined,
    controller: AbortController
  ) => {
    if (!file) return alert("no file selected"); // if no file selected return
    if (file.size > 10 * 1024 * 1024)
      return alert("image should be less than 10mb"); // if image is to big return

    setState("uploading"); // set state of upload

    const formData = new FormData(); // create a formData to send file
    formData.append("file", file); // append the selected file to the form

    try {
      const result = await axios.request({
        method: "POST",
        url: "/api/upload/image",
        data: formData,
        signal: controller.signal,
        onUploadProgress: (p) => {
          setProgress((p.loaded * 100) / p.total);
        },
      });
      console.log(result, 'results');
      
      if (result.status === 200) {
        setState("uploaded");
        setImageUrl(result.data.url);
      }
    } catch (err) {
      const error: Error = err as Error;
      let message = "An error occured during the upload,";
      if (error.name === "AbortError") message = "Upload aborted,";
      const c = confirm(`${message} try again ?`);
      c ? setState("upload") : undefined;
    }
  };

  const handleOndragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  const handleOndrop = (event: React.DragEvent<HTMLDivElement>) => {
    //prevent the browser from opening the image
    event.preventDefault();
    event.stopPropagation();
    //let's grab the image file
    let file = event.dataTransfer.files[0];
    setFile(file);
  };
  return (
    <form className="bg-white md:max-w-[50%] lg:max-w-2xl w-[70%] rounded-xl shadow-sm relative flex flex-col justify-between ">
      <header className="flex justify-between items-center text-slate-800 p-4">
        <h1 className="font-bold ">Upload Image</h1>
      </header>

      <div id="divider" className="border border-slate-200" />

      <div className="p-4">
        <input
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          type="file"
          name="image"
          id="image"
          onChange={handleChange}
        />

        {state === "uploading" ? (
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
        ) : state === "uploaded" ? (
          <div className="relative w-full group border-dashed border-slate-200 hover:border-blue-400 transition-colors flex flex-col justify-center items-center  rounded-lg">
            <img src={imageUrl} alt="uploaded image" className="rounded-lg" />
            <div className="w-full flex items-center p-1 border border-slate-200 rounded-lg mt-2">
              <p className="text-ellipsis whitespace-nowrap overflow-hidden ml-1">
                {imageUrl}{" "}
              </p>
              <button
                type="button"
                onClick={() => copyToClipboard(imageUrl)}
                className="bg-blue-400 px-4 py-2 rounded-lg text-white font-medium hover:bg-blue-500 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        ) : (
          <>
            <div
              onDragOver={handleOndragOver}
              onDrop={handleOndrop}
              onClick={() => fileInputRef.current?.click()}
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
          </>
        )}
        {state === "uploaded" && (
          <button
            type="button"
            onClick={() => setState("upload")}
            className="border border-gray-200 rounded-lg px-4 py-1 font-medium mt-2"
          >
            restart
          </button>
        )}
      </div>
    </form>
  );
};

export default Uploader;
