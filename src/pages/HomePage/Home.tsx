import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export const HomePage: React.FC = () => {
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        dayMaxEvents={3}
        events={[
          { title: "Meeting", date: "2025-12-31" },
          { title: "Meeting", date: "2025-12-22" },
          {
            title: "Vacation",
            start: "2025-12-20",
            end: "2025-12-25",
            allDay: true,
            color: "red",
          },
        ]}
      />
    </div>
  );
};
