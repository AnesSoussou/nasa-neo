/**
 * Fetches data about Near-Earth Objects (NEOs) from NASA's API and displays them as a bar chart or table, 
 * allowing the user to filter by orbital body (e.g., Earth, Mars) and toggle between chart and table views.
 */

import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { fetchNEOs } from '../services/api';
import Filter from './Filter';
import TableView from './TableView';

const NeoChart = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orbitalBodies, setOrbitalBodies] = useState([]); 
  const [selectedBody, setSelectedBody] = useState(''); 
  const [view, setView] = useState('chart');

 // Recuperate Data via API
  useEffect(() => {
    const getData = async () => {
      try {
        const neoData = await fetchNEOs();

        
        const chartData = neoData.map((neo) => [
          neo.name,
          neo.estimated_diameter.kilometers.estimated_diameter_min,
          neo.estimated_diameter.kilometers.estimated_diameter_max,
          neo.close_approach_data[0]?.orbiting_body || 'Unknown', // Adding Default value
        ]);

        // Extract unique celestial bodies (all available celestial bodies)
        const bodies = [...new Set(chartData.map((item) => item[3]))].sort();

        setData([['Name', 'Min Diameter', 'Max Diameter', 'Orbit'], ...chartData]);
        setFilteredData(chartData);
        setOrbitalBodies(bodies); // Store the orbits
      } catch (err) {
        setError('Unable to load the data.');
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // Update the filtered data when the selected orbit changes
  useEffect(() => {
    if (selectedBody) {
      setFilteredData(data.filter((row) => row[3] === selectedBody));
    } else {
      setFilteredData(data);
    }
  }, [selectedBody, data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const chartHeight = selectedBody === '' ? '600px' : '400px';

  return (
    <div className="p-4 space-y-5">
      {/* Switcher between chart and table */}
      <div className="mb-4">
        <button
          onClick={() => setView('chart')}
          className={`px-4 py-2 mr-2 ${view === 'chart' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Graph View
        </button>
        <button
          onClick={() => setView('table')}
          className={`px-4 py-2 ${view === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Table View
        </button>
      </div>

      <Filter orbitalBodies={orbitalBodies} onFilterChange={setSelectedBody} />

      {/* Display according to the selected view */}
      {view === 'chart' ? (
        <Chart
          chartType="Bar"
          data={[['Name', 'Min Diameter', 'Max Diameter'], ...filteredData.map((row) => row.slice(0, 3))]}
          options={{
            title: 'Estimated Diameters of NEOs',
            chartArea: { width: '60%' },
            hAxis: { title: 'Diameter (km)' },
            vAxis: { title: 'NEO Name' },
            legend: { position: 'top' },
          }}
          width="100%"
          height={chartHeight}
        />
      ) : (
        <TableView data={filteredData} />
      )}
    </div>
  );
};

export default NeoChart;
