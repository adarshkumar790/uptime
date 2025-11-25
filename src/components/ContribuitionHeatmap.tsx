import  { useMemo } from "react";
import ReactECharts from "echarts-for-react";

interface ContributionHeatmapProps {
  username?: string;
  data?: [string, number][];
  yearRange?: [string, string];
}

export default function ContributionHeatmap({
  data = [],
  yearRange,
}: ContributionHeatmapProps) {
  const SQUARE_SIZE = 4;
  const GAP = 0.4;

  const option = useMemo(() => {
    if (!data || data.length === 0) return null;

    const values: [string, number][] = data.map(([date, count]) => [date, count]);
    const max = Math.max(...values.map((v) => v[1]), 4);

    const range =
      yearRange?.length
        ? yearRange
        : [values[0][0], values[values.length - 1][0]];

    return {
      tooltip: {
        formatter: (params: any) =>
          `${params.value[0]} : ${params.value[1]} contributions`,
      },

      visualMap: {
        min: 0,
        max,
        inRange: {
          color: ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"],
        },
        show: false,
      },

      calendar: {
        range,
        cellSize: [SQUARE_SIZE, SQUARE_SIZE],
        left: 25,
        right: 10,
        top: 30,
        bottom: 10,

        monthLabel: {
          show: true,
          nameMap: "en",
          margin: 8,
          color: "#57606a",
          fontSize: 10,
        },

        dayLabel: {
          show: true,
          nameMap: ["", "Mon", "", "Wed", "", "Fri", ""],
          fontSize: 8,
          color: "#57606a",
          margin: 6,
        },

        itemStyle: {
          borderWidth: GAP,
          borderColor: "#fff",
        },

        splitLine: { show: false },
        yearLabel: { show: false },
      },

      series: [
        {
          type: "heatmap",
          coordinateSystem: "calendar",
          data: values,
          itemStyle: {
            borderWidth: GAP,
            borderColor: "#fff",
          },
        },
      ],
    };
  }, [data, yearRange]);

  if (!option) {
    return (
      <div className="heatmap-placeholder text-sm text-gray-600">
        No contribution data available
      </div>
    );
  }

  return (
    <div className="heatmap-card w-full">
      <ReactECharts
        option={option}
        style={{ height: 130, width: "100%" }}
      />
      <div className="legend flex items-center gap-2 mt-2 text-xs text-gray-600">
        <span>Less</span>

        <div className="legend-squares flex items-center gap-1">
          <div className="sq w-3 h-3 rounded-md" style={{ background: "#ebedf0" }} />
          <div className="sq w-3 h-3 rounded-md" style={{ background: "#c6e48b" }} />
          <div className="sq w-3 h-3 rounded-md" style={{ background: "#7bc96f" }} />
          <div className="sq w-3 h-3 rounded-md" style={{ background: "#239a3b" }} />
        </div>

        <span>More</span>
      </div>
    </div>
  );
}
