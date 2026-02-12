export default function formatTimerHMS(totalSeconds: number): string {
    if (totalSeconds < 0) return '0s';

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts: string[] = [];

    if (hours > 0) {
        parts.push(`${hours}:`);
    }

    if (minutes > 0) {
        parts.push(`${minutes}:`.padStart(2, '0'));
    } else {
        parts.push('0:')
    }

    parts.push(`${seconds}`.padStart(2, '0'));

    return parts.join('');
}