/**
 * This component displays the filtered data of Near-Earth Objects (NEOs) in a table format,
 * showing their names, minimum and maximum diameters, and the celestial body they orbit.
 */


import React from 'react';

const TableView = ({ data }) => {
    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-400">
                <thead className="bg-gray-200">
                    <tr>
                    <th className="border border-gray-400 p-2">Name</th>
                        <th className="border border-gray-400 p-2">Diameter Min (km)</th>
                        <th className="border border-gray-400 p-2">Diameter Max (km)</th>
                        <th className="border border-gray-400 p-2">Celestial Body</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                            <td className="border border-gray-400 p-2">{row[0]}</td>
                            <td className="border border-gray-400 p-2">
                                {isNaN(row[1]) ? '' : row[1].toFixed(2)} {/* Verification if row[1] is a number */}
                            </td>
                            <td className="border border-gray-400 p-2">
                                {isNaN(row[2]) ? '' : row[2].toFixed(2)} {/* Verification if row[2] is a number */}
                            </td>
                            <td className="border border-gray-400 p-2">{row[3]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableView;
