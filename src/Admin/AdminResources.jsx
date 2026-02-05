
// import React from "react";
// import ResourceUploadAdmin from "./ResourceUploadAdmin";
// import AdminVideoList from "./AdminVideoList";
// import AdminFileList from "./AdminFileList";

// const AdminResources = () => {
//   return (
//     <div className="space-y-10 p-6">
//       {/* 🔼 UPLOAD SECTION (TOP) */}
//       <ResourceUploadAdmin />

//       {/* 🎥 VIDEOS */}
//       <AdminVideoList />

//       {/* 📄 DOCUMENTS & IMAGES */}
//       <AdminFileList />
//     </div>
//   );
// };

// export default AdminResources;


// src/Admin/AdminResources.jsx
import React from "react";
import { UploadCloud, Video, FileText } from "lucide-react";

import ResourceUploadAdmin from "./ResourceUploadAdmin";
import AdminVideoList from "./AdminVideoList";
import AdminFileList from "./AdminFileList";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const AdminResources = () => {
  return (
    <div className="space-y-10">
      {/* HERO */}
      <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
        <h1 className="text-3xl font-bold">Learning Resources</h1>
        <p className="mt-2 text-sm opacity-90">
          Upload and manage videos, documents and learning materials
        </p>
      </div>

      {/* UPLOAD */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <UploadCloud className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-sm">
            Upload New Resource
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResourceUploadAdmin />
        </CardContent>
      </Card>

      {/* VIDEOS */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <Video className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-sm">
            Uploaded Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdminVideoList />
        </CardContent>
      </Card>

      {/* FILES */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-sm">
            Documents & Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdminFileList />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminResources;
