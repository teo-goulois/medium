import React from "react";
type Props = {
  percentage: number;
};
const Loader = ({ percentage }: Props) => {
  const pct = cleanPercentage(percentage);
  return (
    <svg width={100} height={100}>
      <g transform={`rotate(-90 ${"100 100"})`}>
        <Circle colour="rgb(226 232 240)" pct={100} />
        <Circle colour="rgb(96 165 250)" pct={pct} />
      </g>
      <Text percentage={pct} />
    </svg>
  );
};

export default Loader;

const cleanPercentage = (percentage: number) => {
  const isNegativeOrNaN = !Number.isFinite(+percentage) || percentage < 0; // we can set non-numbers to 0 here
  const isTooHigh = percentage > 100;
  return isNegativeOrNaN ? 0 : isTooHigh ? 100 : +percentage;
};

const Circle = ({ colour, pct }: { colour: string; pct: number }) => {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - pct) * circ) / 100;
  return (
    <circle
      r={r}
      cx={150}
      cy={50}
      fill="transparent"
      stroke={strokePct !== circ ? colour : ""} // remove colour as 0% sets full circumference
      strokeWidth={".5rem"}
      strokeDasharray={circ}
      strokeDashoffset={pct ? strokePct : 0}
      strokeLinecap="round"
    ></circle>
  );
};

const Text = ({ percentage }: { percentage: number }) => {
  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize={"1.25em"}
      fontWeight="500"
    >
      {percentage.toFixed(0)}%
    </text>
  );
};
