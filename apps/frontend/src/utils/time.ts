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

export function formatDuration(seconds: number): string {
    if (seconds <= 0) return "0s";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
        return minutes > 0
            ? `${hours}h${minutes}m`
            : `${hours}h`;
    }

    if (minutes > 0) {
        return remainingSeconds > 0
            ? `${minutes}m${remainingSeconds}s`
            : `${minutes}m`;
    }

    return `${remainingSeconds}s`;
}