import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import EventsList from './pages/EventsList';
import EventDetail from './pages/EventDetail';
import MyTickets from './pages/MyTickets';
import Login from './pages/Login';
import Register from './pages/Register';
import OrganizerCheckin from './pages/OrganizerCheckin';
import OrganizerDashboard from './pages/OrganizerDashboard';
import EventForm from './pages/EventForm';
import EventAttendees from './pages/EventAttendees';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<EventsList />} />
              <Route path="events" element={<EventsList />} />
              <Route path="event/:id" element={<EventDetail />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              
              {/* Participant Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['peserta']} />}>
                <Route path="my-tickets" element={<MyTickets />} />
              </Route>

              {/* Organizer Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['panitia']} />}>
                <Route path="panitia/dashboard" element={<OrganizerDashboard />} />
                <Route path="panitia/checkin" element={<OrganizerCheckin />} />
                <Route path="panitia/events/new" element={<EventForm />} />
                <Route path="panitia/events/edit/:id" element={<EventForm />} />
                <Route path="panitia/events/:id/attendees" element={<EventAttendees />} />
              </Route>
              
              <Route path="*" element={<h2 className="text-center text-2xl">404 Not Found</h2>} />
            </Route>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
