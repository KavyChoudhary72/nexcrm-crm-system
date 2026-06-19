import { useState, useCallback } from "react";
import { Activity } from "../types/activity.types";
import { activityService } from "../services/activity.service";

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchActivities = useCallback(async (leadId: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await activityService.getActivities(leadId);
      setActivities(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load activities");
    } finally {
      setLoading(false);
    }
  }, []);

  const createActivity = async (leadId: string, type: string, content: string) => {
    try {
      const created = await activityService.createActivity(leadId, { type, content });
      setActivities((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      throw new Error(err.message || "Failed to log activity");
    }
  };

  return {
    activities,
    loading,
    error,
    fetchActivities,
    createActivity,
    setActivities,
  };
};
