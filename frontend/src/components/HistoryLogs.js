import React from 'react';
import { deleteEntry } from '../api';

const HistoryLogs = ({ data, isAdmin, refreshData }) => {
    
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                await deleteEntry(id);
                refreshData(); // Real-time update
            } catch (err) {
                alert("Delete failed: Admin access required.");
            }
        }
    };

    // Sort data: Newest first
    const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="grid">
            <div className="card" style={{ gridColumn: '1 / -1' }}>
                <h3>📜 Transaction History</h3>
                <div className="history-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Details</th>
                                <th>Amount</th>
                                {isAdmin && <th>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((item) => (
                                <tr key={item._id}>
                                    <td><small>{new Date(item.date).toLocaleDateString()}</small></td>
                                    <td>
                                        <span className={`badge ${item.type}`}>
                                            {item.type.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        {item.consumptionData || item.note || "-"}
                                        {item.pricePerEgg && <small><br/>@ ₹{item.pricePerEgg}/egg</small>}
                                    </td>
                                    <td>{item.amount ? `₹${item.amount}` : "-"}</td>
                                    {isAdmin && (
                                        <td>
                                            <button 
                                                onClick={() => handleDelete(item._id)}
                                                style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HistoryLogs;



const downloadCSV = () => {
    // 1. Define the headers for the Excel file
    const headers = ["Date", "Type", "Details", "Amount", "Payer"];
    
    // 2. Map your MongoDB data into rows
    const rows = data.map(item => [
        new Date(item.date).toLocaleDateString(),
        item.type.toUpperCase(),
        item.consumptionData || item.note || "N/A",
        item.amount || 0,
        item.payer || "N/A"
    ]);

    // 3. Create the CSV content
    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");

    // 4. Trigger the download in the browser
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Master_Ledger_Backup_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};



<div className="card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>📜 Transaction History</h3>
        <button onClick={downloadCSV} className="btn-pay" style={{ width: 'auto', padding: '5px 15px' }}>
            📥 Export to Excel
        </button>
    </div>
    {/* ... rest of your history table ... */}
</div>