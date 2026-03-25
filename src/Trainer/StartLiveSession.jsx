
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Video, Circle } from "lucide-react";
import { createLiveSession } from "@/services/liveSessionService";
import { getTrainerBatches } from "@/services/batchService";

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
import { Switch } from "@/components/ui/switch";

const StartLiveSession = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    batchId: "",
    date: "",
    time: "",
    duration: "",
    chat: true,
    recording: true,
    notifications: true,
  });

  // ✅ Batches from backend (not hardcoded)
  const [batches, setBatches] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const durations = ["15", "30", "45", "60", "75", "90"];

  /* ================= LOAD BATCHES FROM BACKEND ================= */
  useEffect(() => {
    const loadBatches = async () => {
      try {
        const data = await getTrainerBatches();
        setBatches(data || []);
      } catch (err) {
        console.error("Failed to load batches:", err);
      }
    };

    loadBatches();
  }, []);

  /* ================= GO LIVE ================= */
  const handleGoLive = async () => {
    try {
      setSubmitting(true);

      const payload = {
        title: form.title,
        description: form.description,
        batchId: Number(form.batchId),
        scheduledDate: form.date,
        scheduledTime: form.time,
        duration: Number(form.duration),
        chatEnabled: form.chat,
        autoRecord: form.recording,
        notifyStudents: form.notifications,
      };

      const res = await createLiveSession(payload);
      const session = res.data;

      navigate(`/trainer/live-controls/${session.id}`);
    } catch (error) {
      console.error("Failed to create session:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-black dark:bg-[#0B1120] dark:text-white">

      {/* ================= HEADER ================= */}
      <div className="px-8 py-6 rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/trainer/live")}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Video size={22} />
              Start Live Session
            </h2>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">

        {/* ================= SESSION DETAILS ================= */}
        <Card className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10">
          <CardContent className="p-6 space-y-5">

            {/* TITLE */}
            <div className="space-y-2">
              <Label>Session Title</Label>
              <Input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>

            {/* BATCH SELECT — loaded from backend */}
            <div className="space-y-2">
              <Label>Select Batch</Label>
              <Select
                value={form.batchId}
                onValueChange={(v) => updateField("batchId", v)}
              >
                <SelectTrigger className="bg-white text-black border-gray-300 dark:bg-[#1F2937] dark:text-white dark:border-white/10">
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>

                <SelectContent className="z-50 bg-white text-black border border-gray-200 dark:bg-[#111827] dark:text-white dark:border-white/10">
                  {Array.isArray(batches) && batches.map((b, index) => {
                    const id = b.id ?? b.batchId ?? b.batch_id;
                    const name = b.name ?? b.batchName ?? `Batch (ID: ${id})`;
                    return (
                      <SelectItem key={index} value={String(id)}>
                        {name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* DATE & TIME */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => updateField("time", e.target.value)}
                />
              </div>
            </div>

            {/* DURATION */}
            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Select
                value={form.duration}
                onValueChange={(v) => updateField("duration", v)}
              >
                <SelectTrigger className="bg-white text-black border-gray-300 dark:bg-[#1F2937] dark:text-white dark:border-white/10">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>

                <SelectContent className="z-50 bg-white text-black border border-gray-200 dark:bg-[#111827] dark:text-white dark:border-white/10">
                  {durations.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </CardContent>
        </Card>

        {/* ================= SESSION SETTINGS ================= */}
        <Card className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10">
          <CardContent className="p-6 space-y-6">
            <h3 className="font-semibold text-lg">Session Settings</h3>

            <div className="flex items-center justify-between">
              <Label>Enable Chat</Label>
              <Switch
                checked={form.chat}
                onCheckedChange={(checked) => updateField("chat", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Auto Record</Label>
              <Switch
                checked={form.recording}
                onCheckedChange={(checked) => updateField("recording", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Notify Students</Label>
              <Switch
                checked={form.notifications}
                onCheckedChange={(checked) => updateField("notifications", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ================= GO LIVE BUTTON ================= */}
        <Button
          onClick={handleGoLive}
          disabled={submitting}
          className="w-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Circle size={10} className="animate-pulse" />
          {submitting ? "Starting..." : "Go Live Now"}
        </Button>

      </div>
    </div>
  );
};

export default StartLiveSession;