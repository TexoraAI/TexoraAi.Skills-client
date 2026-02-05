// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { getAssignmentById } from "@/services/assignmentService";
// import { Button } from "@/components/ui/button";

// export default function AssignmentDetail() {
//   const { id } = useParams();
//   const [assignment, setAssignment] = useState(null);

//   useEffect(() => {
//     getAssignmentById(id).then(setAssignment);
//   }, [id]);

//   if (!assignment) return null;

//   return (
//     <div className="p-6 space-y-4">
//       <h1 className="text-2xl font-bold">{assignment.title}</h1>
//       <p className="text-muted-foreground">{assignment.description}</p>

//       {/* 📄 DOCUMENT PREVIEW */}
//       <iframe
//         src={assignment.documentUrl}
//         title="Assignment Document"
//         className="w-full h-[70vh] border rounded-lg"
//       />

//       <div className="flex gap-3">
//         <Button asChild>
//           <a href={assignment.documentUrl} download>
//             Download Document
//           </a>
//         </Button>

//         <Button variant="outline">
//           Submit Assignment
//         </Button>
//       </div>
//     </div>
//   );
// }
