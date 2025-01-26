import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';

export default function CalendarPage() {
  const [calendars, setCalendars] = useState([]);
  const [newCalendar, setNewCalendar] = useState('');

  useEffect(() => {
    const fetchCalendars = async () => {
      const calendarCollection = collection(db, `users/${auth.currentUser.uid}/calendars`);
      const calendarSnapshot = await getDocs(calendarCollection);
      setCalendars(calendarSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchCalendars();
  }, []);

  const createCalendar = async () => {
    await addDoc(collection(db, `users/${auth.currentUser.uid}/calendars`), {
      name: newCalendar,
      createdAt: Timestamp.now(),
    });
    setNewCalendar('');
  };

  return (
    <div>
      <h2>I tuoi calendari</h2>
      <ul>
        {calendars.map(calendar => (
          <li key={calendar.id}>{calendar.name}</li>
        ))}
      </ul>
      <input type="text" value={newCalendar} onChange={(e) => setNewCalendar(e.target.value)} />
      <button onClick={createCalendar}>Crea Calendario</button>
    </div>
  );
}
