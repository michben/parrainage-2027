// ============================================================
// Compte à rebours jusqu'au second tour (dimanche 2 mai 2027, 20h00
// heure de Paris). +02:00 fixé explicitement (heure d'été en vigueur
// début mai) pour que le compte soit correct quel que soit le fuseau
// horaire du visiteur, au lieu de dépendre de son horloge locale.
// ============================================================
const COUNTDOWN_TARGET = new Date('2027-05-02T20:00:00+02:00').getTime();

function updateCountdown() {
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');
  if (!daysEl) return;

  const remainingMs = COUNTDOWN_TARGET - Date.now();
  if (remainingMs <= 0) {
    daysEl.textContent = '0';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    document.querySelector('.countdown-label').textContent = 'Le prochain président a été élu';
    return;
  }

  const totalMinutes = Math.floor(remainingMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  daysEl.textContent = String(days);
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);
