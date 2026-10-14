/**
 * Checks office hours for Delegación Municipal
 * Mon-Fri: 8:00 to 17:00 hs
 * Sat: 8:00 to 13:00 hs
 * Sun: closed
 * Time zone: America/Argentina/Buenos_Aires (UTC-3)
 */
export function getDelegationStatus(): {
  isOpen: boolean;
  statusText: string;
  nextEventText: string;
  badgeClass: string;
} {
  try {
    // Current time in Argentina
    const now = new Date();
    const argTimeStr = now.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' });
    const argDate = new Date(argTimeStr);

    const day = argDate.getDay(); // 0 is Sunday, 6 is Saturday
    const hours = argDate.getHours();
    const minutes = argDate.getMinutes();
    const currentDecimalHour = hours + minutes / 60;

    // Sunday
    if (day === 0) {
      return {
        isOpen: false,
        statusText: 'Cerrado hoy domingo',
        nextEventText: 'Abre el lunes a las 08:00 hs',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-200'
      };
    }

    // Saturday
    if (day === 6) {
      if (currentDecimalHour >= 8 && currentDecimalHour < 13) {
        return {
          isOpen: true,
          statusText: 'Abierto ahora',
          nextEventText: 'Atención hoy sábado hasta las 13:00 hs',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
      }
      return {
        isOpen: false,
        statusText: 'Cerrado por hoy',
        nextEventText: 'Abre el lunes a las 08:00 hs',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200'
      };
    }

    // Monday to Friday
    if (day >= 1 && day <= 5) {
      if (currentDecimalHour >= 8 && currentDecimalHour < 17) {
        return {
          isOpen: true,
          statusText: 'Abierto ahora',
          nextEventText: 'Atención hoy hasta las 17:00 hs',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
      } else if (currentDecimalHour < 8) {
        return {
          isOpen: false,
          statusText: 'Abre hoy a las 08:00 hs',
          nextEventText: 'Horario: 8:00 a 17:00 hs',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200'
        };
      } else {
        const nextDayName = day === 5 ? 'mañana sábado a las 08:00 hs' : 'mañana a las 08:00 hs';
        return {
          isOpen: false,
          statusText: 'Cerrado por hoy',
          nextEventText: `Abre ${nextDayName}`,
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200'
        };
      }
    }
  } catch (e) {
    // Fallback if timezone not supported
  }

  return {
    isOpen: true,
    statusText: 'Horario: Lun-Vie 8 a 17 hs · Sáb 8 a 13 hs',
    nextEventText: 'Atención presencial y virtual',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };
}

export function generateTicketNumber(): string {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `DEL-${year}-${randomDigits}`;
}
