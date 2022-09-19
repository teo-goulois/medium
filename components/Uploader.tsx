import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
// Components
import Upload from "./Upload";
import Uploaded from "./Uploaded";
import Uploading from "./Uploading";

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
    <div className="bg-white md:max-w-[50%] lg:max-w-2xl w-[70%] rounded-xl shadow-sm relative flex flex-col justify-between ">
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
          <Uploading progress={progress} setFile={setFile} />
        ) : state === "uploaded" ? (
          <Uploaded url={imageUrl} />
        ) : (
          <Upload
            fileRef={fileInputRef}
            handleOndragOver={handleOndragOver}
            handleOndrop={handleOndrop}
          />
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
    </div>
  );
};

export default Uploader;
