// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Clock,
//   Calendar,
//   User,
//   BookOpen,
//   Award,
//   ChevronRight,
//   AlertCircle,
//   ArrowLeft,
//   ArrowRight,
// } from "lucide-react";
// import { startTest, StartTestResponse } from "@/app/lib/data/test-data";
// import { SemesterTest } from "@/app/lib/data/server-test-data";
// import { Account } from "@/app/lib/definitions";
// import { useRouter } from "next/navigation";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { SimpleThemeToggle } from "@/components/theme-toggle";
// import { Button } from "@/components/ui/button";
// import WaitingHeader from "./waiting-header";
// import {
//   TestWaitingSocket,
//   WaitingRoomUpdate,
// } from "@/app/lib/websocket/test-socket";

// interface Props {
//   testData: SemesterTest;
//   user: Account;
// }

// export default function TestWaitingClient({ testData, user }: Props) {
//   console.log(testData);
//   const router = useRouter();
//   const [countdown, setCountdown] = useState<{
//     days: number;
//     hours: number;
//     minutes: number;
//     seconds: number;
//   } | null>(null);
//   const [isStarting, setIsStarting] = useState(false);
//   const [canStart, setCanStart] = useState(false);
//   const [testStatus, setTestStatus] = useState<
//     "upcoming" | "ongoing" | "ended"
//   >("upcoming");

//   const [waitingRoom, setWaitingRoom] = useState<WaitingRoomUpdate | null>(
//     null
//   );
//   const [socket, setSocket] = useState<TestWaitingSocket | null>(null);

//   // Initialize WebSocket
//   useEffect(() => {
//     const ws = new TestWaitingSocket(
//       testData.id,
//       user.id,
//       `${user.lastName} ${user.firstName}`,
//       user.cccd
//     );

//     ws.connect((update) => {
//       console.log("Waiting room update:", update);
//       setWaitingRoom(update);
//     });

//     setSocket(ws);

//     return () => {
//       ws.disconnect();
//     };
//   }, [testData.id, user]);

//   // Tính toán countdown
//   useEffect(() => {
//     const calculateCountdown = () => {
//       const now = new Date();
//       const startTime = new Date(testData.startDate);
//       const endTime = new Date(testData.endDate);

//       // Kiểm tra trạng thái bài thi
//       if (now >= startTime && now <= endTime) {
//         setCanStart(true);
//         setTestStatus("ongoing");
//         setCountdown(null);
//         return;
//       }

//       if (now < startTime) {
//         const diff = startTime.getTime() - now.getTime();
//         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//         const hours = Math.floor(
//           (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//         );
//         const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//         const seconds = Math.floor((diff % (1000 * 60)) / 1000);

//         setCountdown({ days, hours, minutes, seconds });
//         setCanStart(false);
//         setTestStatus("upcoming");
//         return;
//       }

//       if (now > endTime) {
//         setCanStart(false);
//         setTestStatus("ended");
//         setCountdown(null);
//       }
//     };

//     calculateCountdown();
//     const interval = setInterval(calculateCountdown, 1000);

//     return () => clearInterval(interval);
//   }, [testData]);

//   const handleStartTest = async () => {
//     setIsStarting(true);
//     try {
//       // Call trực tiếp đến backend từ client
//       const result = await startTest(testData.id);

//       if (result.success) {
//         router.push(`/test/${testData.id}/exam?resultId=${result.resultId}`);
//       } else {
//         alert(result.message || "Không thể bắt đầu bài thi");
//       }
//     } catch (error) {
//       console.error("Error starting test:", error);
//       alert("Đã xảy ra lỗi khi bắt đầu bài thi");
//     } finally {
//       setIsStarting(false);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleString("vi-VN", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header với thông tin user */}
//       <WaitingHeader user={user}></WaitingHeader>

//       {/* Main content */}
//       <div className="max-w-4xl mx-auto px-6 py-12">
//         <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
//           {/* Test Header */}
//           <div className="flex flex-col items-center justify-center pt-8">
//             <h1 className="text-3xl font-bold">{testData.name}</h1>
//             {testStatus === "ongoing" && (
//               <div className="flex items-center ">
//                 <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
//                 <p className="text-sm text-green-800 dark:text-green-300">
//                   Bài thi đang diễn ra
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Test Details */}
//           <div className="p-8 space-y-6">
//             {/* Thông tin thời gian */}
//             <div className="grid md:grid-cols-2 gap-6">
//               <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
//                 <Calendar className="w-5 h-5 " />
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-1">
//                     Thời gian bắt đầu
//                   </p>
//                   <p className="font-semibold text-foreground">
//                     {formatDate(testData.startDate)}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
//                 <Clock className="w-5 h-5" />
//                 <div>
//                   <p className="text-sm text-muted-foreground mb-1">
//                     Thời gian kết thúc
//                   </p>
//                   <p className="font-semibold text-foreground">
//                     {formatDate(testData.endDate)}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Vị trí/Đối tượng */}
//             <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
//               <Award className="w-5 h-5 text-accent-foreground" />
//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">
//                   Đối tượng thi
//                 </p>
//                 <p className="font-semibold text-foreground">
//                   {testData.test.position.name}
//                 </p>
//               </div>
//             </div>

//             {/* Countdown hoặc thông báo */}
//             {testStatus === "upcoming" && countdown && (
//               <div className="bg-background rounded-lg p-4">
//                 <p className="text-sm mb-4 text-center">
//                   Thời gian còn lại đến khi bắt đầu:
//                 </p>

//                 <div className="grid grid-cols-4 gap-4">
//                   {[
//                     { label: "Ngày", value: countdown.days },
//                     { label: "Giờ", value: countdown.hours },
//                     { label: "Phút", value: countdown.minutes },
//                     { label: "Giây", value: countdown.seconds },
//                   ].map((item) => (
//                     <div
//                       key={item.label}
//                       className="bg-background rounded-lg p-4 text-center"
//                     >
//                       <div className="text-3xl font-bold">
//                         {item.value.toString().padStart(2, "0")}
//                       </div>
//                       <div className="text-xs text-muted-foreground mt-1">
//                         {item.label}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {testStatus === "ended" && (
//               <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
//                 <div className="flex items-center gap-3">
//                   <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
//                   <p className="font-semibold text-red-800 dark:text-red-300">
//                     Bài thi đã kết thúc
//                   </p>
//                 </div>
//                 <p className="text-sm text-red-700 dark:text-red-400 mt-2">
//                   Thời gian làm bài đã hết. Bạn không thể tham gia bài thi này
//                   nữa.
//                 </p>
//               </div>
//             )}

//             {/* Nút bắt đầu */}
//             <Button
//               onClick={handleStartTest}
//               disabled={!canStart || isStarting}
//               className="w-full h-12 bg-primary text-primary-foreground py-4 px-6 disabled:hidden disabled:cursor-not-allowed "
//             >
//               {isStarting ? (
//                 <p className="text-lg">ĐANG VÀO BÀI...</p>
//               ) : (
//                 <p className="text-lg">BẮT ĐẦU</p>
//               )}
//             </Button>
//           </div>
//         </div>
//         {/* Online Users List */}
//         {waitingRoom && waitingRoom.totalUsers > 0 && (
//           <div className="mt-6 bg-card rounded-2xl shadow-xl overflow-hidden p-6">
//             <h3 className="text-lg font-semibold mb-4">
//               Đang chờ thi ({waitingRoom.totalUsers} người)
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               {Array.from(waitingRoom.users).map((userInfo) => (
//                 <div
//                   key={userInfo.userId}
//                   className="flex items-center gap-3 p-3 bg-background rounded-lg"
//                 >
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <div>
//                     <p className="font-medium">{userInfo.fullName}</p>
//                     <p className="text-sm text-muted-foreground">
//                       {userInfo.cccd}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
