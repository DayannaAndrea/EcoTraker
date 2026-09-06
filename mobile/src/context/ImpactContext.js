import React, { createContext, useContext, useMemo, useState } from "react";

const ImpactContext = createContext(null);

export function ImpactProvider({ children }) {
  const [foodRecords, setFoodRecords] = useState([]);
  const [travelRecords, setTravelRecords] = useState([]);

  const addFoodRecord = record => {
    setFoodRecords(current => [
      { ...record, id: `${Date.now()}-${Math.random()}`, createdAt: new Date().toISOString(), type: "food" },
      ...current
    ]);
  };

  const addTravelRecord = record => {
    setTravelRecords(current => [
      { ...record, id: `${Date.now()}-${Math.random()}`, createdAt: new Date().toISOString(), type: "travel" },
      ...current
    ]);
  };

  const removeFoodRecord = id => setFoodRecords(current => current.filter(item => item.id !== id));
  const removeTravelRecord = id => setTravelRecords(current => current.filter(item => item.id !== id));

  const foodTotal = useMemo(() => foodRecords.reduce((sum, item) => sum + Number(item.co2 || 0), 0), [foodRecords]);
  const travelTotal = useMemo(() => travelRecords.reduce((sum, item) => sum + Number(item.co2 || 0), 0), [travelRecords]);
  const totalImpact = foodTotal + travelTotal;
  const allRecords = useMemo(() => [...foodRecords, ...travelRecords], [foodRecords, travelRecords]);

  return (
    <ImpactContext.Provider value={{
      foodRecords, travelRecords, allRecords,
      foodTotal, travelTotal, totalImpact,
      addFoodRecord, addTravelRecord,
      removeFoodRecord, removeTravelRecord
    }}>
      {children}
    </ImpactContext.Provider>
  );
}

export function useImpact() {
  const context = useContext(ImpactContext);
  if (!context) throw new Error("useImpact debe utilizarse dentro de ImpactProvider");
  return context;
}
