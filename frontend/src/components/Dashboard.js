import React, { useState } from 'react';
import AdminEntry from './AdminEntry';
import { deleteEntry } from '../api';

const Dashboard = ({ data, isAdmin, aliases, refreshData }) => {

    const [activeTab, setActiveTab] = useState('egg');

    const stats = {
        egg: { eaten: 0, paid: 0, cost: 0, members: {}, history: [], payments: [], bought: 0 },
        bike: { total: 0, members: { v: 0, D: 0, h: 0 }, history: [] },
        personal: { total: 0, history: [] }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Permanent Delete?")) {
            await deleteEntry(id);
            refreshData();
        }
    };

    data.forEach(item => {

        const pk = item.payer || item.n;

        if (item.type === 'egg_log') {

            const p = item.pricePerEgg || 6;

            stats.egg.history.push(item);

            (item.consumptionData || item.t)?.split(';').forEach(e => {

                const match = e.trim().match(/(\d+)\s*([a-zA-Z]+)/);

                if (match) {

                    const [_, count, key] = match;

                    const n = parseInt(count);

                    if (!stats.egg.members[key])
                        stats.egg.members[key] = { e: 0, c: 0, p: 0 };

                    stats.egg.members[key].e += n;
                    stats.egg.members[key].c += n * p;

                    stats.egg.eaten += n;
                    stats.egg.cost += n * p;
                }

            });

        }

        else if (item.type === 'egg_pay') {

            stats.egg.payments.push(item);

            if (!stats.egg.members[pk])
                stats.egg.members[pk] = { e: 0, c: 0, p: 0 };

            stats.egg.members[pk].p += item.amount;

            stats.egg.paid += item.amount;

            const price = item.pricePerEgg || 6;
            const eggsBought = item.amount / price;

            stats.egg.bought += eggsBought;

        }

        else if (item.type === 'bike_pay') {

            stats.bike.total += item.amount;
            stats.bike.history.push(item);

            if (stats.bike.members.hasOwnProperty(pk))
                stats.bike.members[pk] += item.amount;

        }

        else if (item.type === 'expense') {

            stats.personal.total += item.amount;
            stats.personal.history.push(item);

        }

    });

    const stock = stats.egg.bought - stats.egg.eaten;

    return (

        <div className="container">

            <div className="tabs">
                <button className={`tab-btn ${activeTab === 'egg' ? 'active' : ''}`} onClick={() => setActiveTab('egg')}>🥚 Eggs</button>
                <button className={`tab-btn ${activeTab === 'bike' ? 'active' : ''}`} onClick={() => setActiveTab('bike')}>🏍️ Bike</button>
                {isAdmin && <button className={`tab-btn ${activeTab === 'expense' ? 'active' : ''}`} onClick={() => setActiveTab('expense')}>💸 Expenses</button>}
            </div>

            {activeTab === 'egg' && (

                <div className="section active">

                    <div className="stat-row">

                        <div className="stat-box">
                            <small>STOCK (EGGS)</small>
                            <h2>{stock.toFixed(1)}</h2>
                        </div>

                        <div className="stat-box">
                            <small>TOTAL EATEN</small>
                            <h2>{stats.egg.eaten}</h2>
                        </div>

                        <div className="stat-box">
                            <small>SPENT</small>
                            <h2 style={{ color: 'red' }}>₹{stats.egg.cost.toFixed(0)}</h2>
                        </div>

                    </div>

                    {isAdmin && <AdminEntry type="egg" refreshData={refreshData} aliases={aliases} />}

                    <div className="card">

                        <h3>📊 Member Balances</h3>

                        <table>

                            <thead>
                                <tr>
                                    <th>MEMBER</th>
                                    <th>EATEN</th>
                                    <th>FOOD COST</th>
                                    <th>PAID</th>
                                    <th>BALANCE</th>
                                </tr>
                            </thead>

                            <tbody>

                                {Object.entries(aliases).map(([k, name]) => {

                                    if (k === 'w') return null;

                                    const m = stats.egg.members[k] || { e: 0, c: 0, p: 0 };

                                    const bal = m.p - m.c;

                                    return (
                                        <tr key={k}>
                                            <td><b>{name}</b></td>
                                            <td>{m.e}</td>
                                            <td>₹{m.c.toFixed(1)}</td>
                                            <td>₹{m.p}</td>
                                            <td className={bal >= 0 ? 'bal-pos' : 'bal-neg'}>
                                                ₹{bal.toFixed(2)}
                                            </td>
                                        </tr>
                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                    <div className="grid">

                        <div className="card">

                            <h3>💰 Egg Payments</h3>

                            <div className="scrollbox">

                                <table>

                                    <tbody>

                                        {stats.egg.payments.slice().reverse().map(p => (

                                            <tr key={p._id}>
                                                <td>{new Date(p.date).toLocaleDateString()}</td>
                                                <td><b>{aliases[p.payer || p.n]}</b></td>
                                                <td>₹{p.amount}</td>
                                                {isAdmin && <td><button className="del" onClick={() => handleDelete(p._id)}>✕</button></td>}
                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                        <div className="card">

                            <h3>📜 Egg History</h3>

                            <div className="scrollbox">

                                <table>

                                    <tbody>

                                        {stats.egg.history.slice().reverse().map(l => (

                                            <tr key={l._id}>
                                                <td>{new Date(l.date).toLocaleDateString()}</td>
                                                <td>{l.consumptionData || l.t}</td>
                                                {isAdmin && <td><button className="del" onClick={() => handleDelete(l._id)}>✕</button></td>}
                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

};

export default Dashboard;