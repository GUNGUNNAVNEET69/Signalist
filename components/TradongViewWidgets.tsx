"use client";
import useTradingViewWidgets from "@/hooks/useTradingViewWidgets";
import React, { useRef, memo } from "react";

interface TradingViewWidgetProps {
  title?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
}
const TradingViewWidget = ({
  title,
  scriptUrl,
  config,
  height = 600,
  className,
}: TradingViewWidgetProps) => {
  const containerRef = useTradingViewWidgets(scriptUrl, config, height);
  const cn = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(" ");
  };
  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}

      <div
        className={cn("tradingview-widget-copyright", className)}
        ref={containerRef}
        id="tradingview-widget-copyright"
      >
        <div
          className="tradingview-widget-container__widget"
          style={{ height, width: "100%" }}
        ></div>
      </div>
    </div>
  );
};

export default memo(TradingViewWidget);
