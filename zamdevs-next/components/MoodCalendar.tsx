import React, { useState } from 'react';

const palette = {
  purple: '#A09ABC',
  lilac: '#B6A6CA',
  lightLilac: '#D5CFE1',
  paleLilac: '#E1D8E9',
  blush: '#D4BEBE',
};

const moods = [
  { emoji: '😊', color: palette.lilac },
  { emoji: '😐', color: palette.purple },
  { emoji: '😢', color: palette.blush },
  { emoji: '😕', color: palette.lightLilac },
  { emoji: '😀', color: palette.paleLilac },
];

// Placeholder mood data for the current month
function getMoodForDay(day: number) {
  // Cycle through moods for demo
  return moods[day % moods.length];
}

export default function MoodCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Generate calendar grid
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return (
    <div style={{ background: palette.paleLilac, borderRadius: 20, padding: 24, boxShadow: '0 2px 12px #D5CFE1', maxWidth: 420, margin: '0 auto' }}>
      <div style={{ fontWeight: 700, color: palette.purple, fontSize: 20, marginBottom: 12, textAlign: 'center', letterSpacing: 1 }}>
        {today.toLocaleString('default', { month: 'long' })} {year}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6, color: palette.purple, fontWeight: 600, fontSize: 14, textAlign: 'center' }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {weeks.flat().map((day, idx) => (
          <div key={idx} style={{ aspectRatio: '1/1', position: 'relative', cursor: day ? 'pointer' : 'default' }} onClick={() => day && setSelectedDay(day)}>
            {day && (
              <>
                <div style={{ fontWeight: 500, color: palette.purple, fontSize: 15 }}>{day}</div>
                <div style={{ position: 'absolute', left: '50%', bottom: 6, transform: 'translateX(-50%)', fontSize: 18 }}>
                  {getMoodForDay(day).emoji}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {/* Modal/Tooltip for selected day */}
      {selectedDay && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(160,154,188,0.18)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedDay(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 260, boxShadow: '0 4px 24px #D5CFE1', color: palette.purple, position: 'relative' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Day {selectedDay}</div>
            <div style={{ fontSize: 32 }}>{getMoodForDay(selectedDay).emoji}</div>
            <div style={{ color: palette.lilac, marginTop: 12 }}>"Sample journal entry for day {selectedDay}."</div>
            <button style={{ position: 'absolute', top: 10, right: 16, background: 'none', border: 'none', fontSize: 20, color: palette.purple, cursor: 'pointer' }} onClick={() => setSelectedDay(null)}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
} 