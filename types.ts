import firebase from 'firebase/compat/app';

export interface AppUser {
  uid: string;
  email: string | null;
  namaLengkap: string;
  role: 'peserta' | 'panitia';
}

export interface Event {
  id: string;
  namaAcara: string;
  tanggal: firebase.firestore.Timestamp;
  lokasi: string;
  harga: number;
  deskripsiSingkat: string;
  organizerId: string; // Tautan ke user panitia
  isPublished?: boolean; // To control visibility
}

export type TicketStatus = 'pending' | 'paid' | 'used';

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  namaPeserta: string;
  emailPeserta: string;
  status: TicketStatus;
  qrCodeString: string;
  createdAt: firebase.firestore.Timestamp;
  event?: Event; // populated after fetching
}