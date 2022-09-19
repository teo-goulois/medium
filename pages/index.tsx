import type { NextPage } from "next";
import Uploader from "../components/Uploader";

const Home: NextPage = () => {
  
  return (
    <div className="h-screen w-screen bg-slate-100 flex justify-center items-center">
      <Uploader />
    </div>
  );
};

export default Home;
