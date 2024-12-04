import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { fetchNEOs } from '../services/api';

// This component fetches data from NASA's API regarding Near-Earth Objects (NEOs).
const NeoChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                // Fetching NEO data via the API
                const neoData = await fetchNEOs();

                // Preparing data for the chart
                const chartData = neoData
                    .map((neo) => [
                        neo.name,
                        neo.estimated_diameter.kilometers.estimated_diameter_min,
                        neo.estimated_diameter.kilometers.estimated_diameter_max,
                    ])
                    .sort(
                        (a, b) =>
                            (b[1] + b[2]) / 2 - (a[1] + a[2]) / 2 // Sorting by descending average diameter
                    );

                setData([['Name', 'Min Diameter', 'Max Diameter'], ...chartData]);
            } catch (err) {
                setError('Unable to load the data.');
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Chart
            chartType="Bar"
            data={data}
            options={{
                title: 'Estimated diameters of NEOs',
                chartArea: { width: '50%' },
                hAxis: { title: 'Diameter (km)' },
            }}
            width="100%"
            height="400px"
        />
    );
};

export default NeoChart;
