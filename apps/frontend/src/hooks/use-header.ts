import { ReactNode, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { LayoutContext } from "../components/DefaultLayout";

export default function useHeader(header: ReactNode) {
    const { setHeaderContent } = useOutletContext<LayoutContext>();

    useEffect(() => {
        console.log('setting header')
        setHeaderContent(header);

        return () => setHeaderContent(null);
    }, [])
}