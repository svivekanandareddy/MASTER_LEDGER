import React, { useState } from 'react';

import { addEntry } from '../api';



const AdminEntry = ({ type, refreshData, aliases }) => {

    const [form, setForm] = useState({

        date: new Date().toISOString().split('T')[0],

        time: "10:00 AM",

        amount: '',

        payer: 'v',

        pricePerEgg: 6,

        note: ''

    });



    const [counts, setCounts] = useState({ v: 0, D: 0, h: 0, vig: 0, w: 0 });



    const handleLogSubmit = async (e) => {

        e.preventDefault();

        const dataStr = Object.entries(counts)

            .filter(([_, val]) => val > 0)

            .map(([k, v]) => `${v}${k}`).join(' ; ');

       

        await addEntry({ ...form, type: 'egg_log', consumptionData: dataStr });

        setCounts({ v: 0, D: 0, h: 0, vig: 0, w: 0 });

        refreshData();

    };



    const handleGeneralSubmit = async (e) => {

        e.preventDefault();

        const entryType = type === 'egg' ? 'egg_pay' : (type === 'bike' ? 'bike_pay' : 'expense');

        await addEntry({ ...form, type: entryType });

        setForm({ ...form, amount: '', note: '' });

        refreshData();

    };



    if (type === 'egg') {

        return (

            <div className="grid">

                {/* LOG CONSUMPTION FORM */}

                <form className="card" onSubmit={handleLogSubmit}>

                    <h3>📝 Log Consumption</h3>

                    <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />

                    {Object.keys(counts).map(k => (

                        <div key={k} style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>

                            <label>{aliases[k]}</label>

                            <input type="number" className="num-input" value={counts[k]} onChange={e => setCounts({...counts, [k]: e.target.value})} />

                        </div>

                    ))}

                    <input type="number" placeholder="Price per Egg" value={form.pricePerEgg} onChange={e => setForm({...form, pricePerEgg: e.target.value})} />

                    <button className="btn-egg">Log Today's Eggs</button>

                </form>



                {/* EGG PAYMENT FORM */}

                <form className="card" onSubmit={handleGeneralSubmit}>

                    <h3>💰 Egg Payment</h3>

                    <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />

                    <input type="text" placeholder="Payer (v/h/D)" value={form.payer} onChange={e => setForm({...form, payer: e.target.value})} />

                    <input type="number" placeholder="Amount (₹)" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />

                    <input type="number" placeholder="Purchase Price/Egg" value={form.pricePerEgg} onChange={e => setForm({...form, pricePerEgg: e.target.value})} />

                    <button className="btn-pay" style={{backgroundColor:'#27ae60'}}>Log Payment</button>

                </form>

            </div>

        );

    }



    return (

        <form className="card" onSubmit={handleGeneralSubmit}>

            <h3>{type === 'bike' ? '⛽ Petrol Entry' : '💸 Personal Expense'}</h3>

            <div className="form-row">

                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />

                {type === 'expense' && <input type="text" placeholder="Time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />}

            </div>

            <input type="number" placeholder="Amount (₹)" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />

            {type === 'expense' ?

                <input type="text" placeholder="Note (Rent, Tea, etc.)" value={form.note} onChange={e => setForm({...form, note: e.target.value})} /> :

                <input type="text" placeholder="Who paid? (v/h/D)" value={form.payer} onChange={e => setForm({...form, payer: e.target.value})} />

            }

            <button className={type === 'bike' ? 'btn-bike' : 'btn-expense'}>Add Entry</button>

        </form>

    );

};



export default AdminEntry;