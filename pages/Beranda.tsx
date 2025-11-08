import React from "react";
import "./beranda.css";

// ==== TIPE DATA ====
type EventItem = {
  id: string;
  image: string;
  title: string;
  city: string;
  date: string;
  price: string;
};

type EventCardProps = { item: EventItem };

// ==== DATA DUMMY ====
const events: EventItem[] = [
  {
    id: "e1",
    image: "/assets/gambarfesti.png",
    title: "Festival Musik 2025",
    city: "Jakarta",
    date: "25 Okt 2025",
    price: "Rp 150.000",
  },
  {
    id: "e2",
    image: "/assets/gambarpunkre.png",
    title: "Pertemuan Puncak Kreatif",
    city: "Bandung",
    date: "15 Nov 2025",
    price: "Rp 75.000",
  },
  {
    id: "e3",
    image: "/assets/gambarmaraton.png",
    title: "Maraton Kota",
    city: "Surabaya",
    date: "7 Des 2025",
    price: "Rp 100.000",
  },
];

// ==== KOMPONEN CARD ====
const EventCard: React.FC<EventCardProps> = ({ item }) => {
  return (
    <article className="card" aria-labelledby={`title-${item.id}`}>
      <div className="card__thumb">
        <img
          src={item.image}
          alt={item.title}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
          }}
        />
      </div>
      <div className="card__body">
        <h4 id={`title-${item.id}`} className="card__title">
          {item.title}
        </h4>

        <div className="card__meta">
          <div>📍 {item.city}</div>
          <div>📅 {item.date}</div>
          <div>💸 {item.price}</div>
        </div>

        <button className="btn btn--accent card__cta" type="button">
          Lihat
          <br />
          Detail
        </button>
      </div>
    </article>
  );
}

// ==== KOMPONEN UTAMA ====
export default function Beranda() {
  return (
    <div className="home">
      {/* HERO */}
      <header className="hero" role="banner">
        <img
          className="hero__bg"
          src="/assets/gambarbesar.png"
          alt=""
          aria-hidden="true"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
          }}
        />
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1 className="hero__title">
            Telusuri Pengalaman <br /> Baru Anda
          </h1>
          <button className="btn btn--accent btn--lg" type="button">
            Temukan Acara Sekarang
          </button>
        </div>
      </header>

      {/* SEARCH & FILTER BAR */}
      <section className="filters" aria-label="Filter">
        <div className="filters__row">
          <label className="input input--search" aria-label="Cari acara">
            <span aria-hidden="true">🔍</span>
            <input placeholder="Cari acara..." />
          </label>

          <div className="promo" role="note">
            <div className="promo__text">
              <b>Acara Populer: Konferensi Teknologi Masa Depan 2025.</b> <br />
              Dapatkan Tiket Anda!
            </div>
            <button className="btn btn--ghost" type="button">
              Telusuri
            </button>
          </div>

          <button className="chip" type="button">
            <span aria-hidden="true">📍</span>Lokasi
          </button>
          <button className="chip" type="button">
            <span aria-hidden="true">🗂️</span>Kategori
          </button>
        </div>
      </section>

      {/* LABEL FILTER */}
      <div className="label-filter">Filter</div>

      {/* GRID EVENTS */}
      <section className="grid" aria-label="Daftar acara">
        {events.map((ev) => (
          <EventCard key={ev.id} item={ev} />
        ))}
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div>© 2025 Tixly. Semua Tiket Tersedia.</div>
        <div className="footer__contact">
          <span>Email: info@tixly.com</span>
          <span>Phone: +6281234567890</span>
          <a href="#" aria-label="Facebook">
            📘
          </a>
          <a href="#" aria-label="Instagram">
            📸
          </a>
          <a href="#" aria-label="X">
            ✖️
          </a>
        </div>
      </footer>
    </div>
  );
}
