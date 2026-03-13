import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { fetchData, addEntry } from './api';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

const App = () => {
    const [data, setData] = useState([]);
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role')
    });

    const aliases = { "v": "Vivek", "D": "Datha", "h": "Hithesh", "vig": "Vignesh", "w": "Wastage" };
    const isAdmin = auth.role === 'admin';

    const refreshData = useCallback(async () => {
        try {
            const res = await fetchData();
            setData(res.data);
        } catch (err) {
            console.error("Database sync failed.");
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const migrateLocalStorageToMongo = async () => {
        let localData = JSON.parse(localStorage.getItem('masterLedger_v11'));
        if (!localData) {
            const manualData = window.prompt("Paste your JSON data here:");
            if (!manualData) return;
            try { localData = JSON.parse(manualData); } catch (e) { return alert("Invalid JSON."); }
        }

        const confirmMigration = window.confirm(`Migrate legacy records to MongoDB?`);
        if (!confirmMigration) return;

        try {
            alert("Migration started...");
            if (localData.eggLogs) {
                for (let log of localData.eggLogs) {
                    await addEntry({ type: 'egg_log', date: new Date(log.d), consumptionData: log.t, pricePerEgg: log.p || 6 });
                }
            }
            if (localData.eggPays) {
                for (let pay of localData.eggPays) {
                    await addEntry({ type: 'egg_pay', date: new Date(pay.d), payer: pay.n, amount: pay.a, pricePerEgg: pay.p || 6 });
                }
            }
            if (localData.bikePays) {
                for (let b of localData.bikePays) {
                    await addEntry({ type: 'bike_pay', date: new Date(b.d), payer: b.n, amount: b.a });
                }
            }
            if (localData.expenses) {
                for (let x of localData.expenses) {
                    await addEntry({ type: 'expense', date: new Date(x.d), time: x.tm || "10:00", amount: x.a, note: x.n || "Legacy" });
                }
            }
            localStorage.removeItem('masterLedger_v11'); 
            alert("✅ Migration Successful!");
            refreshData(); 
        } catch (err) {
            alert("Migration failed.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        setAuth({ token: null, role: null });
        window.location.href = "/";
    };

    return (
        <Router>
            <div className="container">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div onClick={() => window.location.href = "/"} style={{ cursor: 'pointer' }}>
                        <h1>Vivek & Co.</h1>
                        <p style={{ fontSize: '0.8rem', color: '#718096' }}>{isAdmin ? "🛠️ Admin Mode" : "👁️ Guest Mode"}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {isAdmin && <button className="btn-bike" style={{ width: 'auto', padding: '8px 15px' }} onClick={migrateLocalStorageToMongo}>📥 Import Data</button>}
                        {auth.token ? (
                            <button className="btn-pay" style={{ width: 'auto', padding: '8px 15px' }} onClick={handleLogout}>Logout</button>
                        ) : (
                            <button className="btn-egg" style={{ width: 'auto', padding: '8px 15px' }} onClick={() => window.location.href = "/login"}>Admin Login</button>
                        )}
                    </div>
                </header>

                <Routes>
                    <Route path="/login" element={auth.token ? <Navigate to="/" /> : <Login setAuth={setAuth} />} />
                    <Route path="/" element={<Dashboard data={data} isAdmin={isAdmin} aliases={aliases} refreshData={refreshData} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;