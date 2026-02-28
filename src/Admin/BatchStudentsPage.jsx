// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   getAvailableStudents,
//   getTrainerStudents,
//   assignStudentsToTrainer,
//   removeStudentFromTrainer,
// } from "../services/batchService";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";

// const BatchStudentsPage = () => {
//   const { batchId, trainerEmail } = useParams();

//   const decodedEmail = decodeURIComponent(trainerEmail);

//   const [students, setStudents] = useState([]);
//   const [assigned, setAssigned] = useState([]);

//   /* ================= LOAD DATA ================= */

//   const load = async () => {
//     try {
//       const available = await getAvailableStudents(batchId, decodedEmail);
//       setStudents(available.data || []);

//       const map = await getTrainerStudents(batchId);
//       setAssigned(map?.[decodedEmail] || []);
//     } catch (e) {
//       console.error("Failed loading students", e);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, [batchId, trainerEmail]);

//   /* 🔥 ASSIGN / REMOVE STUDENT */
//   const toggleStudent = async (email) => {
//     try {
//       if (assigned.includes(email)) {
//         // remove mapping
//         await removeStudentFromTrainer(batchId, decodedEmail, email);
//       } else {
//         // assign mapping
//         const updated = [...assigned, email];
//         await assignStudentsToTrainer(batchId, decodedEmail, updated);
//       }

//       await load();
//     } catch (e) {
//       console.error("Failed updating students", e);
//       alert("Failed to update students");
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">Students under {decodedEmail}</h1>

//       {students.length === 0 && (
//         <p className="text-muted-foreground">No available students</p>
//       )}

//       {students.map((s) => {
//         const isAssigned = assigned.includes(s.email);

//         return (
//           <Card key={s.email}>
//             <CardContent className="flex justify-between items-center p-4">
//               <div>
//                 <p className="font-semibold">
//                   {s.displayName || s.email.split("@")[0]}
//                 </p>
//                 <p className="text-sm text-muted-foreground">{s.email}</p>
//               </div>

//               <Button
//                 variant={isAssigned ? "destructive" : "default"}
//                 onClick={() => toggleStudent(s.email)}
//               >
//                 {isAssigned ? "Remove" : "Assign"}
//               </Button>
//             </CardContent>
//           </Card>
//         );
//       })}
//     </div>
//   );
// };

// export default BatchStudentsPage;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAvailableStudents,
  getTrainerStudents,
  assignStudentsToTrainer,
  removeStudentFromTrainer,
} from "../services/batchService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BatchStudentsPage = () => {
  const { batchId, trainerEmail } = useParams();
  const decodedEmail = decodeURIComponent(trainerEmail);

  const [availableStudents, setAvailableStudents] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);

  /* ================= LOAD DATA ================= */

  const load = async () => {
    try {
      // available
      const available = await getAvailableStudents(batchId, decodedEmail);
      setAvailableStudents(available.data || []);

      // assigned
      const map = await getTrainerStudents(batchId);
      const assigned = (map?.[decodedEmail] || []).filter(
        (e) => e && e !== "__EMPTY__",
      );

      setAssignedStudents(assigned);
    } catch (e) {
      console.error("Failed loading students", e);
    }
  };

  useEffect(() => {
    load();
  }, [batchId, trainerEmail]);

  /* ================= ACTIONS ================= */

  const assignStudent = async (email) => {
    try {
      const updated = [...assignedStudents, email];
      await assignStudentsToTrainer(batchId, decodedEmail, updated);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const removeStudent = async (email) => {
    try {
      await removeStudentFromTrainer(batchId, decodedEmail, email);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Students under {decodedEmail}</h1>

      {/* ASSIGNED STUDENTS */}
      {assignedStudents.map((email) => (
        <Card key={email}>
          <CardContent className="flex justify-between items-center p-4">
            <div>
              <p className="font-semibold">{email.split("@")[0]}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>

            <Button variant="destructive" onClick={() => removeStudent(email)}>
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* AVAILABLE STUDENTS */}
      {availableStudents.map((s) => (
        <Card key={s.email}>
          <CardContent className="flex justify-between items-center p-4">
            <div>
              <p className="font-semibold">
                {s.displayName || s.email.split("@")[0]}
              </p>
              <p className="text-sm text-muted-foreground">{s.email}</p>
            </div>

            <Button onClick={() => assignStudent(s.email)}>Assign</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BatchStudentsPage;
