import { ready, cls } from 'https://lsong.org/scripts/dom.js';
import { h, render, useState, useEffect } from 'https://lsong.org/scripts/react/index.js';

const App = () => {
  const [events, setEvents] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    console.log('App is ready');
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    setEvents(storedEvents);

    const calendar = document.querySelector('x-calendar');
    const handleDateSelected = (e) => {
      setSelectedDate(e.detail);
      setStartDate(e.detail);
      setEndDate(e.detail);
    };
    calendar.addEventListener('dateSelected', handleDateSelected);

    return () => {
      calendar.removeEventListener('dateSelected', handleDateSelected);
    };
  }, [filter]);

  const addEvent = (e) => {
    e.preventDefault();
    const eventId = Date.now().toString();
    const newEvent = {
      id: eventId,
      startDate,
      endDate,
      description,
      completed: false
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setDescription('');
    // setFilter('all');
  };

  const toggleEventComplete = (eventId) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        return { ...event, completed: !event.completed };
      }
      return event;
    });
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const deleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const filteredEvents = () => {
    return events.filter(event => {
      if (!selectedDate) {
        // If no date is selected, include all events
        if (filter === 'active') return !event.completed;
        if (filter === 'completed') return event.completed;
        return true;
      }

      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const selected = new Date(selectedDate);

      const dateInRange = selected >= eventStart && selected <= eventEnd;

      if (filter === 'active') return !event.completed && dateInRange;
      if (filter === 'completed') return event.completed && dateInRange;
      return dateInRange;
    });
  };

  const sortedFilteredEvents = filteredEvents().sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return [
    h('div', { className: 'scheduler-header' }, [
      h('div', { id: 'eventFilters' }, [
        h('label', null, [
          h('input', { type: 'radio', name: 'filter', value: 'all', checked: filter === 'all', onChange: () => setFilter('all') }),
          "All"
        ]),
        h('label', null, [
          h('input', { type: 'radio', name: 'filter', value: 'active', checked: filter === 'active', onChange: () => setFilter('active') }),
          "Todo"
        ]),
        h('label', null, [
          h('input', { type: 'radio', name: 'filter', value: 'completed', checked: filter === 'completed', onChange: () => setFilter('completed') }),
          "Done"
        ]),
        h('label', null, [
          h('input', { type: 'radio', name: 'filter', value: 'create', checked: filter === 'create', onChange: () => setFilter('create') }),
          "New"
        ])
      ])
    ]),
    filter === 'create' ? h('form', { className: 'event-form', onSubmit: addEvent }, [
      h('div', { className: 'flex gap-10' }, [
        h('div', { className: 'form-field' }, [
          h('label', null, "Start"),
          h('input', { type: 'date', className: 'input input-block', value: startDate, onChange: (e) => setStartDate(e.target.value), required: true })
        ]),
        h('div', { className: 'form-field' }, [
          h('label', null, "End"),
          h('input', { type: 'date', className: 'input input-block', value: endDate, onChange: (e) => setEndDate(e.target.value), required: true })
        ])
      ]),
      h('div', { className: 'form-field' }, [
        h('input', { type: 'text', className: 'input input-block', value: description, onChange: (e) => setDescription(e.target.value), placeholder: 'Description', required: true }),
      ]),
      h('div', { className: 'form-field' }, [
        h('button', { type: 'submit', className: 'button button-primary' }, "Create Event")
      ]),
    ])
    :
    h('div', { id: 'eventList' },
      sortedFilteredEvents.length > 0 ?
        sortedFilteredEvents.map(event =>
          h('div', { className: cls('event-item', { 'event-completed': event.completed }), key: event.id }, [
            h('input', {
              type: 'checkbox',
              checked: event.completed,
              onChange: () => toggleEventComplete(event.id)
            }),
            h('div', { className: 'event-item-content' },
              h('time', null, `${event.startDate} - ${event.endDate}`),
              h('span', { className: 'event-item-description' }, event.description)
            ),
            h('button', { onClick: () => deleteEvent(event.id), className: 'delete-btn' }, "🗑️")
          ])
        )
        : h('p', null, selectedDate ? "No events found for the selected date." : "No events found.")
    )
  ];
};

ready(() => {
  const app = document.getElementById('app');
  render(h(App), app);
});