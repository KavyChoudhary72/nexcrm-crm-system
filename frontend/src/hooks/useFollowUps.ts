import { useState, useEffect, useCallback } from "react";
import { FollowUp } from "../types/followUp.types";
import { followUpService } from "../services/followUp.service";

export const useFollowUps = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFollowUps = useCallback(async (params?: Record<string, any>) => {
    setLoading(true);
    setError("");
    try {
      const data = await followUpService.getFollowUps(params);
      setFollowUps(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load follow-ups");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFollowUps();
  }, [fetchFollowUps]);

  const createFollowUp = async (followUpData: { leadId: string; title: string; date: string; notes?: string }) => {
    try {
      const created = await followUpService.createFollowUp(followUpData);
      setFollowUps((prev) => [...prev, created]);
      return created;
    } catch (err: any) {
      throw new Error(err.message || "Failed to schedule follow-up");
    }
  };

  const completeFollowUp = async (id: string, notes?: string) => {
    try {
      const completed = await followUpService.completeFollowUp(id, notes);
      setFollowUps((prev) => prev.map((f) => (f._id === id ? completed : f)));
      return completed;
    } catch (err: any) {
      throw new Error(err.message || "Failed to complete follow-up");
    }
  };

  return {
    followUps,
    loading,
    error,
    fetchFollowUps,
    createFollowUp,
    completeFollowUp,
  };
};
