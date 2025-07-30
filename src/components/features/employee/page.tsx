"use client";
import { MainLayout } from "@/layout/mainLayout";
import { EmployeeTable } from "./components/EmployeeTable";
import React, { useEffect } from "react";

export default function EmployeePage() {
  const [tableData, setTableData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [divisions, setDivisions] = React.useState<Record<string, string>>({});
  const fetchDivisions = async () => {
    try {
      const response = await fetch("/api/division");
      if (!response.ok) {
        throw new Error("Failed to fetch divisions");
      }
      const divisions = await response.json();

      // Buat map { id: name }
      const map = divisions.reduce((acc: any, item: any) => {
        acc[item.id] = item.name;
        return acc;
      }, {});
      setDivisions(map);
    } catch (error) {
      console.error("Error fetching divisions:", error);
    }
  };

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/employee");
      if (!response.ok) {
        throw new Error("Failed to fetch employee data");
      }
      const employees = await response.json();

      const mappedEmployees = employees.map((emp: any) => ({
        ...emp,
        divisionName: divisions[emp.division] || "Unknown",
      }));

      setTableData(mappedEmployees);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchDivisions();
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (Object.keys(divisions).length > 0) {
      fetchEmployees();
    }
  }, [divisions]);
  return (
    <MainLayout title="Create Employee">
      <EmployeeTable data={tableData} isLoading={isLoading} />
    </MainLayout>
  );
}
