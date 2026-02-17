export default function formatDate(date: string) {
    const options: Intl.DateTimeFormatOptions = {
        month: 'short',      // Oct
        day: 'numeric',      // 24
        year: 'numeric',     // 2023
        hour: 'numeric',     // 4
        minute: '2-digit',   // 30
        hour12: true         // AM/PM
    };

    const d = new Date(date);

    return Intl.DateTimeFormat('en-US', options).format(d);
}