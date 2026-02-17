import { useEffect, useRef, useState } from "react";

type Props = {
    targetId: string;
    title: string;
    description: string;
};

export const SpotlightCoachmark = ({ targetId, title, description }: Props) => {
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [position, setPosition] = useState<"top" | "bottom">("bottom");
    const savedStyleRef = useRef<CSSStyleDeclaration | null>(null);

    useEffect(() => {
        const target = document.getElementById(targetId);

        if (!target) return;

        console.log(target)
        savedStyleRef.current = { ...target.style };

        const updateRect = () => {
            const rect = target.getBoundingClientRect();
            setTargetRect(rect);

            const spaceAbove = rect.top;
            const spaceBelow = window.innerHeight - rect.bottom;
            setPosition(spaceBelow > spaceAbove ? "bottom" : "top");
        };

        updateRect();

        // target.style.position = "relative";????
        target.style.zIndex = "1003";

        window.addEventListener("resize", updateRect);
        window.addEventListener("scroll", updateRect, true);

        return () => {
            if (target && savedStyleRef.current) {
                target.style.position = savedStyleRef.current.position || "";
                target.style.zIndex = savedStyleRef.current.zIndex || "";
            }
            window.removeEventListener("resize", updateRect);
            window.removeEventListener("scroll", updateRect, true);
        };
    }, [targetId]);

    if (!targetRect) return null;

    const bubbleWidth = 280;

    const bubbleLeft = Math.min(
        window.innerWidth - bubbleWidth - 8,
        Math.max(8, targetRect.left + targetRect.width / 2 - bubbleWidth / 2)
    );

    const bubbleTop =
        position === "bottom"
            ? targetRect.bottom + 8
            : targetRect.top - 8 - 80; // 80 — примерная высота подсказки

    const bubbleStyle: React.CSSProperties = {
        position: "fixed",
        left: bubbleLeft,
        top: bubbleTop,
        width: bubbleWidth,
        background: "#111",
        color: "#fff",
        padding: "12px 16px",
        borderRadius: 12,
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        border: "1px solid #00E5FF",
        fontFamily: "sans-serif",
        zIndex: 1002,
    };

    return (
        <>
            {/* overlay */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "rgba(0,0,0,0.5)",
                    zIndex: 1002
                }}
            />

            {/* подсказка */}
            <div style={bubbleStyle} role="dialog" aria-modal="true">
                {title && (
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>
                        {title}
                    </div>
                )}
                <div style={{ fontSize: 14, lineHeight: 1.4 }}>{description}</div>
            </div>
        </>
    );
};
