import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Event } from '../types';

const EventTable: React.FC<{ 
  events: Event[]; 
  onDelete: (id: string) => void;
  onPublishToggle: (id: string, newStatus: boolean) => void; 
}> = ({ events, onDelete, onPublishToggle }) => {
  const navigate = useNavigate();
  const isPublishedList = events[0]?.isPublished ?? false;

  useEffect(() => {
    // @ts-ignore
    window.lucide?.createIcons();
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Event Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {events.map(event => (
            <tr key={event.id} className="hover:bg-muted/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{event.namaAcara}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{event.tanggal && new Date(event.tanggal.seconds * 1000).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{event.lokasi}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end items-center space-x-4">
                  <button onClick={() => navigate(`/panitia/events/${event.id}/attendees`)} className="text-muted-foreground hover:text-foreground" title="Attendees"><i data-lucide="users" className="h-4 w-4"></i></button>
                  <button onClick={() => navigate(`/panitia/events/edit/${event.id}`)} className="text-muted-foreground hover:text-foreground" title="Edit"><i data-lucide="file-pen-line" className="h-4 w-4"></i></button>
                  <button onClick={() => onDelete(event.id)} className="text-destructive/70 hover:text-destructive" title="Delete"><i data-lucide="trash-2" className="h-4 w-4"></i></button>
                  {isPublishedList ? (
                     <button onClick={() => onPublishToggle(event.id, false)} className="text-muted-foreground hover:text-foreground" title="Unpublish"><i data-lucide="eye-off" className="h-4 w-4"></i></button>
                  ) : (
                     <button onClick={() => onPublishToggle(event.id, true)} className="text-green-500 hover:text-green-400" title="Publish"><i data-lucide="eye" className="h-4 w-4"></i></button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const OrganizerDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchEvents = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const eventsCollectionRef = db.collection('events');
      const q = eventsCollectionRef.where('organizerId', '==', currentUser.uid);
      const eventSnapshot = await q.get();
      const eventsList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      
      eventsList.sort((a, b) => b.tanggal.seconds - a.tanggal.seconds);

      setEvents(eventsList);
    } catch (error) {
      console.error("Error fetching events: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentUser]);
  
  const { publishedEvents, unpublishedEvents } = useMemo(() => {
    return events.reduce((acc, event) => {
        if(event.isPublished) {
            acc.publishedEvents.push(event);
        } else {
            acc.unpublishedEvents.push(event);
        }
        return acc;
    }, { publishedEvents: [] as Event[], unpublishedEvents: [] as Event[]});
  }, [events]);

  const handleDelete = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await db.collection('events').doc(eventId).delete();
        alert('Event deleted successfully.');
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event.');
      }
    }
  };
  
  const handlePublishToggle = async (eventId: string, newStatus: boolean) => {
    if (!newStatus) {
      if (!window.confirm('Are you sure you want to unpublish this event?')) {
        return; // Stop if the user cancels
      }
    }
    try {
        await db.collection('events').doc(eventId).update({ isPublished: newStatus });
        alert(`Event ${newStatus ? 'published' : 'unpublished'} successfully.`);
        fetchEvents();
    } catch (error) {
        console.error('Error updating event status:', error);
        alert('Failed to update event status.');
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-muted-foreground">Loading your dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold text-foreground">Organizer Dashboard</h1>
        <div className="space-x-4">
          <Link to="/panitia/checkin" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-5 py-2 rounded-md font-medium transition-colors">
            Check-In
          </Link>
           <Link to="/panitia/events/new" className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2 rounded-md font-medium transition-colors">
            + Create New Event
          </Link>
        </div>
      </div>

      <div className="space-y-10">
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Unpublished Drafts</h2>
                {unpublishedEvents.length > 0 ? (
                    <EventTable events={unpublishedEvents} onDelete={handleDelete} onPublishToggle={handlePublishToggle} />
                ) : (
                    <p className="text-center py-8 text-muted-foreground">You have no unpublished events.</p>
                )}
            </div>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Published Events</h2>
                {publishedEvents.length > 0 ? (
                    <EventTable events={publishedEvents} onDelete={handleDelete} onPublishToggle={handlePublishToggle} />
                ) : (
                    <p className="text-center py-8 text-muted-foreground">You haven't published any events yet.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;