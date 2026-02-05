// import { useEffect, useState } from "react";
// import { Calendar, FileText, ArrowRight } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { useNavigate } from "react-router-dom";
// import { getStudentAssignments } from "@/services/assignmentService";

// export default function StudentAssignments() {
//   const [assignments, setAssignments] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     getStudentAssignments()
//       .then(setAssignments)
//       .catch(console.error);
//   }, []);

//   return (
//     <div className="p-6 space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Assignments</h1>
//         <p className="text-sm text-muted-foreground">
//           View, track and submit your assignments
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//         {assignments.map((a) => (
//           <Card key={a.id} className="hover:shadow-xl transition">
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <CardTitle className="text-lg">{a.title}</CardTitle>
//                 <Badge variant="outline">{a.status}</Badge>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 {a.description}
//               </p>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               <div className="flex gap-4 text-sm text-muted-foreground">
//                 <span className="flex items-center gap-1">
//                   <Calendar size={14} /> {a.deadline}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <FileText size={14} /> {a.marks} Marks
//                 </span>
//               </div>

//               <Progress value={a.progress || 0} />

//               <Button
//                 className="w-full"
//                 onClick={() => navigate(`/student/assignments/${a.id}`)}
//               >
//                 View / Submit <ArrowRight size={16} />
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }
