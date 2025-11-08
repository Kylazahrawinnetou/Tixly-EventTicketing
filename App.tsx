import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ModalProvider } from "./contexts/ModalContext";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import EventsList from "./pages/EventsList";
import EventDetail from "./pages/EventDetail";
import MyTickets from "./pages/MyTickets";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OrganizerCheckin from "./pages/OrganizerCheckin";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import EventForm from "./pages/EventForm";
import EventAttendees from "./pages/EventAttendees";

// >>> tambah ini
import Beranda from "./pages/Beranda";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ModalProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* index lama tetap EventsList */}
                <Route index element={<EventsList />} />

                {/* preview beranda Kylazahraa */}
                <Route path="preview/beranda" element={<Beranda />} />

                {/* route lama tetap */}
                <Route path="events" element={<EventsList />} />
                <Route path="event/:id" element={<EventDetail />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

                <Route element={<ProtectedRoute allowedRoles={['peserta']} />}>
                  <Route path="my-tickets" element={<MyTickets />} />
                </Route>

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
        </ModalProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
