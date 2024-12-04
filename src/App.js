import React from 'react';
import NeoChart from './components/Chart';


function App() {
    return (
        <div className="App">
            <header className="text-center p-4 bg-blue-500 text-white">
                <h1>NASA Near Earth Objects</h1>
            </header>
            <main className="p-4">
                <NeoChart />
            </main>
        </div>
    );
}

export default App;
