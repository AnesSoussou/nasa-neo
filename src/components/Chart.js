/**
 * NeoChart Component
 * 
 * This component fetches data from NASA's API regarding Near-Earth Objects (NEOs)
 * and displays a bar chart representing their estimated diameters. 
 * The chart allows users to filter the NEOs by the selected orbiting body, 
 * which updates the chart accordingly to show only the relevant data.
 */


import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { fetchNEOs } from "../services/api";
import FilterDropdown from "./Filter";

const NeoChart = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [orbitalBodies, setOrbitalBodies] = useState([]); // List of orbits
  const [selectedOrbit, setSelectedOrbit] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const neoData = await fetchNEOs();

        // Prepare the data for the chart
        const chartData = neoData
          .map((neo) => [
            neo.name,
            neo.estimated_diameter.kilometers.estimated_diameter_min,
            neo.estimated_diameter.kilometers.estimated_diameter_max,
            neo.close_approach_data[0]?.orbiting_body || "Unknown",
          ])
          .sort(
            (a, b) =>
              (b[1] + b[2]) / 2 - (a[1] + a[2]) / 2 // Trier par diamètre moyen décroissant
          );

        const allOrbitalBodies = [
          ...new Set(chartData.map((item) => item[3])),
        ].sort();

        setData([["Name", "Min Diameter", "Max Diameter", "Orbit"], ...chartData]);
        setFilteredData(chartData.map((item) => item.slice(0, 3))); // Exclure la colonne Orbit
        setOrbitalBodies(allOrbitalBodies);
      } catch (err) {
        setError("Unable to load the data.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleFilterChange = (orbit) => {
    setSelectedOrbit(orbit);

    if (orbit === "") {
      setFilteredData(data.slice(1).map((item) => item.slice(0, 3))); // Ignore the Orbit column
    } else {
      const filtered = data
        .slice(1)
        .filter((item) => item[3] === orbit)
        .map((item) => item.slice(0, 3));
      setFilteredData(filtered);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 space-y-5">
      <FilterDropdown
        orbitalBodies={orbitalBodies}
        selectedOrbit={selectedOrbit}
        onFilterChange={handleFilterChange}
      />

      {filteredData.length > 0 ? (
        <Chart
          chartType="Bar"
          data={[["Name", "Min Diameter", "Max Diameter"], ...filteredData]}
          options={{
            title: "Estimated diameters of NEOs",
            chartArea: { width: "60%" },
            hAxis: { title: "Diameter (km)" },
            vAxis: { title: "NEO Name" },
            legend: { position: "top" },
          }}
          width="100%"
          height="400px"
        />
      ) : (
        <p>No data available for the selected orbit.</p>
      )}
    </div>
  );
};

export default NeoChart;
