import React from "react";
import { TooltipProps } from "recharts";

interface CustomTreemapContentProps {
  root?: any;
  depth?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  colors?: string[];
  formatter?: (value: number) => string;
}

const CustomTreemapContent: React.FC<CustomTreemapContentProps> = ({
  root,
  depth,
  x,
  y,
  width,
  height,
  index,
  colors = [],
  formatter = (value) => value.toString(),
}) => {
  const fill = colors[index % colors.length];
  const name = root.children[index].name;
  const value = root.children[index].value;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill,
          stroke: "#fff",
          strokeWidth: 2,
        }}
      />
      {/* Label with background for better readability */}
      <g>
        <rect
          x={x + width / 2 - 50} // Adjust based on text length
          y={y + height / 2 - 15}
          width={100} // Adjust based on text length
          height={30}
          fill="rgba(0, 0, 0, 0.7)" // Semi-transparent background
          rx={5} // Rounded corners
          ry={5}
        />
        <text
          x={x + width / 2}
          y={y + height / 2 + 5} // Adjust vertical alignment
          textAnchor="middle"
          fill="#fff"
          fontSize={16} // Further increased font size
          fontWeight={600} // Further increased font weight
          style={{
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)", // Add text shadow for better contrast
          }}
        >
          {`${name}: ${formatter(value)}`}
        </text>
      </g>
    </g>
  );
};

export default CustomTreemapContent;