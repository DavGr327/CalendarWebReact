import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import Calendar from 'react-calendar';
import '../styles/calendar.css';

export default function CalendarPage() {
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [newCalendarName, setNewCalendarName] = useState('');
  const [newCalendarDescription, setNewCalendarDescription] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const calendarCollection = collection(db, `users/${user.uid}/calendars`);
          const calendarSnapshot = await getDocs(calendarCollection);
          const calendarList = calendarSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCalendars(calendarList);

          if (calendarList.length > 0) {
            setSelectedCalendar(calendarList[0].id);
          }
        }
      } catch (error) {
        console.error('Errore nel recupero dei calendari:', error);
      }
    };

    fetchCalendars();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (selectedCalendar) {
          const eventsCollection = collection(
            db,
            `users/${auth.currentUser.uid}/calendars/${selectedCalendar}/events`
          );
          const eventSnapshot = await getDocs(eventsCollection);
          const eventList = eventSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().eventDate.toDate(),
          }));
          setEvents(eventList);
        }
      } catch (error) {
        console.error('Errore nel recupero degli eventi:', error);
      }
    };

    if (selectedCalendar) {
      fetchEvents();
    }
  }, [selectedCalendar]);

  const createCalendar = async () => {
    if (newCalendarName.trim()) {
      try {
        const user = auth.currentUser;
        const newCalendarRef = await addDoc(collection(db, `users/${user.uid}/calendars`), {
          name: newCalendarName,
          description: newCalendarDescription,
          createdBy: user.uid,
          createdAt: Timestamp.now(),
        });

        setCalendars([
          ...calendars,
          { id: newCalendarRef.id, name: newCalendarName, description: newCalendarDescription },
        ]);
        setSelectedCalendar(newCalendarRef.id);
        setNewCalendarName('');
        setNewCalendarDescription('');
      } catch (error) {
        console.error('Errore nella creazione del calendario:', error);
      }
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-sidebar">
        <h1>{selectedDate.getDate()}</h1>
        <p>{selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}</p>

        <div className="current-events">
          <strong>Current Events</strong>
          <ul className="event-list">
            {events.length > 0 ? (
              events
                .filter(event => event.date.toDateString() === selectedDate.toDateString())
                .map(event => (
                  <li key={event.id}>{event.title}</li>
                ))
            ) : (
              <li>Nessun evento</li>
            )}
          </ul>
        </div>

        <div className="sidebar-links">
          <a href="#">See past events</a>
        </div>

        <button className="create-event-btn">Create an Event +</button>
      </div>

      <div className="calendar-main">
        <select
          className="calendar-select"
          value={selectedCalendar || ''}
          onChange={(e) => setSelectedCalendar(e.target.value)}
        >
          <option value="" disabled>Seleziona un calendario</option>
          {calendars.map(calendar => (
            <option key={calendar.id} value={calendar.id}>
              {calendar.name}
            </option>
          ))}
          <option value="new">+ Crea nuovo calendario</option>
        </select>

        {selectedCalendar === 'new' && (
          <div className="new-calendar">
            <input
              type="text"
              placeholder="Nome nuovo calendario"
              value={newCalendarName}
              onChange={(e) => setNewCalendarName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Descrizione (opzionale)"
              value={newCalendarDescription}
              onChange={(e) => setNewCalendarDescription(e.target.value)}
            />
            <button onClick={createCalendar}>Crea</button>
          </div>
        )}

        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
        />
      </div>
    </div>
  );
}
