// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { uploadRecording } from "@/services/liveSessionService";
// import { ArrowLeft, UploadCloud, X, Video } from "lucide-react";

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const UploadRecordedVideo = () => {
//   const navigate = useNavigate();
//   const fileRef = useRef(null);

//   const [file, setFile] = useState(null);
//   const [batches, setBatches] = useState([]);
//   const [loadingBatches, setLoadingBatches] = useState(true);

//   const [form, setForm] = useState({
//     lectureTitle: "",
//     shortDescription: "",
//     batchId: "",
//     batchName: "",
//   });

//   const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

//   // Fetch batches
//   useEffect(() => {
//     const fetchBatches = async () => {
//       try {
//         const res = await fetch("/api/batches");
//         const data = await res.json();
//         setBatches(data);
//       } catch (err) {
//         console.error("Batch fetch failed", err);
//       } finally {
//         setLoadingBatches(false);
//       }
//     };

//     fetchBatches();
//   }, []);

//   const handleBatchChange = (value) => {
//     const selected = batches.find((b) => b.id === value);

//     setForm((prev) => ({
//       ...prev,
//       batchId: value,
//       batchName: selected?.batchName || "",
//     }));
//   };

//   const handleUpload = async () => {
//     if (!form.lectureTitle || !form.batchId) {
//       alert("Lecture Title and Batch are required");
//       return;
//     }

//     try {
//       const formData = new FormData();

//       formData.append("file", file);
//       formData.append("title", form.lectureTitle);
//       formData.append("description", form.shortDescription);
//       formData.append("batchId", form.batchId);

//       await uploadRecording(formData);

//       alert("Video uploaded successfully");

//       navigate("/trainer/recorded-list");
//     } catch (error) {
//       console.error("Upload failed", error);
//     }
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-100 dark:bg-[#0B1120] dark:text-white">
//       {/* HEADER */}
//       <div className="px-8 py-6 rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg flex items-center gap-4">
//         <button
//           onClick={() => navigate("/trainer")}
//           className="p-2 rounded-full bg-white/20 hover:bg-white/30"
//         >
//           <ArrowLeft size={18} />
//         </button>

//         <h2 className="text-2xl font-semibold">Upload Recorded Video</h2>
//       </div>

//       <div className="max-w-2xl mx-auto space-y-6">
//         {!file ? (
//           <div
//             onClick={() => fileRef.current.click()}
//             className="rounded-3xl border-2 border-dashed p-16 text-center cursor-pointer bg-gray-50 dark:bg-[#1F2937] border-gray-300 dark:border-white/10"
//           >
//             <UploadCloud size={48} className="mx-auto mb-4 text-blue-500" />
//             <p className="font-semibold mb-3">Choose your video</p>

//             <Button className="bg-blue-600 text-white">Select File</Button>

//             <input
//               ref={fileRef}
//               type="file"
//               accept="video/*"
//               className="hidden"
//               onChange={(e) => setFile(e.target.files[0])}
//             />
//           </div>
//         ) : (
//           <>
//             {/* FILE CARD */}
//             <Card className="bg-white dark:bg-[#1F2937] border dark:border-white/10">
//               <CardContent className="p-5 flex items-center gap-4">
//                 <Video size={20} />
//                 <div className="flex-1">
//                   <p className="font-semibold">{file.name}</p>
//                 </div>
//                 <X
//                   size={18}
//                   className="cursor-pointer"
//                   onClick={() => setFile(null)}
//                 />
//               </CardContent>
//             </Card>

//             {/* FORM */}
//             <Card className="bg-white dark:bg-[#1F2937] border dark:border-white/10">
//               <CardContent className="p-6 space-y-4">
//                 {/* Lecture Title */}
//                 <div>
//                   <Label>Lecture Title</Label>
//                   <Input
//                     value={form.lectureTitle}
//                     onChange={(e) => set("lectureTitle", e.target.value)}
//                     placeholder="Enter Lecture Title"
//                   />
//                 </div>

//                 {/* Short Description */}
//                 <div>
//                   <Label>Short Description</Label>
//                   <Textarea
//                     rows={3}
//                     value={form.shortDescription}
//                     onChange={(e) => set("shortDescription", e.target.value)}
//                     placeholder="Enter short description"
//                   />
//                 </div>

//                 {/* Select Batch */}
//                 <div>
//                   <Label>Select Batch</Label>

//                   <Select onValueChange={handleBatchChange}>
//                     <SelectTrigger
//                       className="bg-white text-black border border-gray-300 
//                                  dark:bg-[#1F2937] dark:text-white 
//                                  dark:border-white/10"
//                     >
//                       <SelectValue
//                         placeholder={
//                           loadingBatches ? "Loading batches..." : "Select Batch"
//                         }
//                       />
//                     </SelectTrigger>

//                     <SelectContent
//                       className="bg-white text-black 
//                                  dark:bg-[#1F2937] dark:text-white"
//                     >
//                       {batches.map((batch) => (
//                         <SelectItem
//                           key={batch.id}
//                           value={batch.id}
//                           className="hover:bg-gray-100 
//                                      dark:hover:bg-white/10"
//                         >
//                           {batch.batchName}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </CardContent>
//             </Card>

//             <Button
//               onClick={handleUpload}
//               className="w-full bg-blue-600 text-white"
//             >
//               Upload & Publish
//             </Button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UploadRecordedVideo;


















import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadRecording } from "@/services/liveSessionService";
import {
  ArrowLeft,
  UploadCloud,
  X,
  Video,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UploadRecordedVideo = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [file, setFile] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    lectureTitle: "",
    shortDescription: "",
    batchId: "",
    batchName: "",
  });

  const set = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ================= FETCH BATCHES ================= */
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await fetch("/api/batches");
        const data = await res.json();
        setBatches(data);
      } catch (err) {
        console.error("Batch fetch failed:", err);
      } finally {
        setLoadingBatches(false);
      }
    };

    fetchBatches();
  }, []);

  const handleBatchChange = (value) => {
    const selected = batches.find((b) => b.id === value);
    setForm((prev) => ({
      ...prev,
      batchId: value,
      batchName: selected?.batchName || "",
    }));
  };

  /* ================= UPLOAD TO BACKEND ================= */
  const handleUpload = async () => {
    if (!form.lectureTitle || !form.batchId) {
      alert("Lecture Title and Batch are required");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", form.lectureTitle);
      formData.append("description", form.shortDescription);
      formData.append("batchId", form.batchId);

      await uploadRecording(formData);

      alert("Video uploaded successfully");
      navigate("/trainer/recorded-list");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-[#0B1120] dark:text-white">

      {/* ================= HEADER ================= */}
      <div className="px-8 py-6 rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg flex items-center gap-4">
        <button
          onClick={() => navigate("/trainer")}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30"
        >
          <ArrowLeft size={18} />
        </button>

        <h2 className="text-2xl font-semibold">
          Upload Recorded Video
        </h2>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">

        {!file ? (
          // ================= DROP ZONE =================
          <div
            onClick={() => fileRef.current.click()}
            className="rounded-3xl border-2 border-dashed p-16 text-center cursor-pointer bg-gray-50 dark:bg-[#1F2937] border-gray-300 dark:border-white/10"
          >
            <UploadCloud size={48} className="mx-auto mb-4 text-blue-500" />
            <p className="font-semibold mb-3">Choose your video</p>

            <Button className="bg-blue-600 text-white">
              Select File
            </Button>

            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        ) : (
          <>
            {/* ================= FILE CARD ================= */}
            <Card className="bg-white dark:bg-[#1F2937] border dark:border-white/10">
              <CardContent className="p-5 flex items-center gap-4">
                <Video size={20} />
                <div className="flex-1">
                  <p className="font-semibold">{file.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <X
                  size={18}
                  className="cursor-pointer hover:text-red-500 transition"
                  onClick={() => setFile(null)}
                />
              </CardContent>
            </Card>

            {/* ================= FORM ================= */}
            <Card className="bg-white dark:bg-[#1F2937] border dark:border-white/10">
              <CardContent className="p-6 space-y-4">

                {/* Lecture Title */}
                <div>
                  <Label>Lecture Title</Label>
                  <Input
                    value={form.lectureTitle}
                    onChange={(e) => set("lectureTitle", e.target.value)}
                    placeholder="Enter Lecture Title"
                  />
                </div>

                {/* Short Description */}
                <div>
                  <Label>Short Description</Label>
                  <Textarea
                    rows={3}
                    value={form.shortDescription}
                    onChange={(e) => set("shortDescription", e.target.value)}
                    placeholder="Enter short description"
                  />
                </div>

                {/* Select Batch */}
                <div>
                  <Label>Select Batch</Label>
                  <Select onValueChange={handleBatchChange}>
                    <SelectTrigger
                      className="bg-white text-black border border-gray-300
                                 dark:bg-[#1F2937] dark:text-white
                                 dark:border-white/10"
                    >
                      <SelectValue
                        placeholder={
                          loadingBatches ? "Loading batches..." : "Select Batch"
                        }
                      />
                    </SelectTrigger>

                    <SelectContent
                      className="bg-white text-black
                                 dark:bg-[#1F2937] dark:text-white"
                    >
                      {batches.map((batch) => (
                        <SelectItem
                          key={batch.id}
                          value={batch.id}
                          className="hover:bg-gray-100 dark:hover:bg-white/10"
                        >
                          {batch.batchName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              </CardContent>
            </Card>

            {/* ================= UPLOAD BUTTON ================= */}
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload & Publish"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadRecordedVideo;