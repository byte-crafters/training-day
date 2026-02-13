import { useAppSelector, } from "../store";
import { useEffect, useState } from 'react';
import formatTimerHMS from '../utils/time';

export default function useTimer() {

    const { accumulated, startedAt } = useAppSelector((state) => state.timer);
    const [seconds, setSeconds] = useState<number>(0);

    useEffect(() => {
        const tick = () => {
            const now = Date.now();
            const total =
                accumulated +
                (startedAt ? now - startedAt : 0);

            setSeconds(Math.floor(total / 1000));
        };

        tick();

        if (!startedAt) return;

        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [startedAt, accumulated]);

    return formatTimerHMS(seconds);
}