import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import client from "../api/client";
import { useAuth } from "./AuthContext";

const ImpactContext = createContext(null);

function normalizeFoodRecord(item) {
  return {
    ...item,
    id: String(item.id),
    co2: Number(item.co2 ?? item.co2_impact ?? 0),
    createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    type: "food"
  };
}

function normalizeTravelRecord(item) {
  return {
    ...item,
    id: String(item.id),
    co2: Number(item.co2 ?? item.co2_impact ?? 0),
    date: item.date || item.createdAt || item.created_at,
    createdAt: item.createdAt || item.created_at || item.date || new Date().toISOString(),
    type: "travel"
  };
}

export function ImpactProvider({ children }) {
  const { user } = useAuth();
  const [foodRecords, setFoodRecords] = useState([]);
  const [travelRecords, setTravelRecords] = useState([]);
  const [chartRecords, setChartRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearData = useCallback(() => {
    setFoodRecords([]);
    setTravelRecords([]);
    setChartRecords([]);
  }, []);

  const refreshDashboard = useCallback(async () => {
    if (!user) {
      clearData();
      return null;
    }

    setLoading(true);
    setError("");
    try {
      const response = await client.get("/dashboard/");
      const data = response.data || {};
      setFoodRecords((data.foodRecords || []).map(normalizeFoodRecord));
      setTravelRecords((data.travelRecords || []).map(normalizeTravelRecord));
      setChartRecords((data.chartRecords || []).map(item => ({ ...item, id: String(item.id), co2: Number(item.co2 || 0), createdAt: item.createdAt, type: item.type })) );
      return data;
    } catch (requestError) {
      setError("No fue posible cargar tus registros.");
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, [user, clearData]);

  useEffect(() => {
    refreshDashboard().catch(() => {});
  }, [refreshDashboard]);

  const addFoodRecord = useCallback(async record => {
    await client.post("/meals/", {
      food: record.food,
      portions: Number(record.portions)
    });
    await refreshDashboard();
  }, [refreshDashboard]);

  const addTravelRecord = useCallback(async record => {
    await client.post("/trips/", {
      transport: record.transport,
      distance: Number(record.distance),
      date: record.date || new Date().toISOString().slice(0, 10)
    });
    await refreshDashboard();
  }, [refreshDashboard]);

  const removeFoodRecord = useCallback(async id => {
    await client.delete(`/meals/${id}/`);
    await refreshDashboard();
  }, [refreshDashboard]);

  const removeTravelRecord = useCallback(async id => {
    await client.delete(`/trips/${id}/`);
    await refreshDashboard();
  }, [refreshDashboard]);

  const foodTotal = useMemo(
    () => foodRecords.reduce((sum, item) => sum + Number(item.co2 || 0), 0),
    [foodRecords]
  );

  const travelTotal = useMemo(
    () => travelRecords.reduce((sum, item) => sum + Number(item.co2 || 0), 0),
    [travelRecords]
  );

  const totalImpact = foodTotal + travelTotal;
  const allRecords = useMemo(
    () => [...foodRecords, ...travelRecords],
    [foodRecords, travelRecords]
  );

  return (
    <ImpactContext.Provider
      value={{
        foodRecords,
        travelRecords,
        chartRecords,
        allRecords,
        foodTotal,
        travelTotal,
        totalImpact,
        loading,
        error,
        refreshDashboard,
        addFoodRecord,
        addTravelRecord,
        removeFoodRecord,
        removeTravelRecord
      }}
    >
      {children}
    </ImpactContext.Provider>
  );
}

export function useImpact() {
  const context = useContext(ImpactContext);
  if (!context) throw new Error("useImpact debe utilizarse dentro de ImpactProvider");
  return context;
}
