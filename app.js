const express = require("express");
const app = express();

app.use(express.json());

let sessions = [];
let currentSession = null;

// Start Work
app.post("/start", (req, res) => {
  if (currentSession) {
    return res.json({ message: "Work already started" });
  }

  currentSession = {
    start: new Date(),
    end: null
  };

  res.json({ message: "Work started", time: currentSession.start });
});

// End Work
app.post("/end", (req, res) => {
  if (!currentSession) {
    return res.json({ message: "No active session" });
  }

  currentSession.end = new Date();

  const duration =
    (currentSession.end - currentSession.start) / (1000 * 60 * 60);

  currentSession.hours = duration;

  sessions.push(currentSession);
  currentSession = null;

  res.json({
    message: "Work ended",
    workedHours: duration.toFixed(2)
  });
});

// Monthly Report
app.get("/report", (req, res) => {
  const totalHours = sessions.reduce(
    (sum, s) => sum + s.hours,
    0
  );

  res.json({
    totalSessions: sessions.length,
    totalHours: totalHours.toFixed(2)
  });
});

// Salary Calculation
app.post("/salary", (req, res) => {
  const { hourlyRate } = req.body;

  const totalHours = sessions.reduce(
    (sum, s) => sum + s.hours,
    0
  );

  const normalHours = 160;
  const overtimeHours =
    totalHours > normalHours ? totalHours - normalHours : 0;

  const normalSalary =
    Math.min(totalHours, normalHours) * hourlyRate;

  const overtimeSalary =
    overtimeHours * hourlyRate * 1.5;

  const totalSalary =
    normalSalary + overtimeSalary;

  res.json({
    totalHours: totalHours.toFixed(2),
    overtimeHours: overtimeHours.toFixed(2),
    totalSalary: totalSalary.toFixed(2)
  });
});

app.listen(3000, () => {
  console.log("Time Tracking API running on port 3000");
});
