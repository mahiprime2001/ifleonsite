import type { ReactNode } from "react";

/**
 * Faceless, editorial-style figures built from one consistent set of shapes, so every scene shares the
 * same proportions. (x, y) is the point between the feet; the figure is about 270 units tall at scale 1.
 */

export type HairStyle = "short" | "bun" | "long" | "curly" | "cap";
export type Pose = "stand" | "point" | "sit" | "carry" | "reach";

export type PersonProps = {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  skin: string;
  hair: string;
  hairStyle?: HairStyle;
  top: string;
  bottom: string;
  shoe?: string;
  pose?: Pose;
  accessory?: ReactNode;
};

const Hair = ({ style, color }: { style: HairStyle; color: string }) => {
  switch (style) {
    case "long":
      return (
        <>
          <path d="M-27 -236 Q-36 -268 0 -270 Q36 -268 27 -236 L31 -184 Q0 -172 -31 -184 Z" fill={color} />
          <path d="M-25 -240 Q-6 -256 24 -242 Q10 -262 -10 -262 Q-26 -258 -25 -240 Z" fill={color} />
        </>
      );
    case "bun":
      return (
        <>
          <circle cx="0" cy="-272" r="13" fill={color} />
          <path d="M-26 -238 Q-28 -266 0 -266 Q28 -266 26 -238 Q14 -250 0 -250 Q-14 -250 -26 -238 Z" fill={color} />
        </>
      );
    case "curly":
      return (
        <g fill={color}>
          <circle cx="-16" cy="-252" r="14" />
          <circle cx="0" cy="-258" r="15" />
          <circle cx="16" cy="-252" r="14" />
          <circle cx="-24" cy="-238" r="10" />
          <circle cx="24" cy="-238" r="10" />
        </g>
      );
    case "cap":
      return (
        <>
          <path d="M-26 -242 Q-26 -270 0 -270 Q26 -270 26 -242 Z" fill={color} />
          <path d="M-2 -244 H 40 Q38 -236 28 -236 H -2 Z" fill={color} />
        </>
      );
    default:
      return <path d="M-26 -238 Q-28 -268 0 -267 Q28 -268 26 -238 Q14 -251 -2 -250 Q-18 -250 -26 -238 Z" fill={color} />;
  }
};

export const Person = ({
  x,
  y,
  scale = 1,
  flip = false,
  skin,
  hair,
  hairStyle = "short",
  top,
  bottom,
  shoe = "#1F2937",
  pose = "stand",
  accessory,
}: PersonProps) => {
  const seated = pose === "sit";
  const drop = seated ? 38 : 0; // seated upper body sits lower

  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {/* soft ground shadow */}
      <ellipse cx="0" cy="2" rx="46" ry="8" fill="#000" opacity=".12" />

      {/* hair behind (long) */}
      {hairStyle === "long" && (
        <g transform={`translate(0 ${drop})`}>
          <Hair style="long" color={hair} />
        </g>
      )}

      {/* legs */}
      {seated ? (
        <g stroke={bottom} strokeWidth="27" strokeLinecap="round" fill="none">
          <path d="M-12 -66 H 46 V -10" />
          <path d="M14 -66 H 72 V -10" />
          <ellipse cx="46" cy="-4" rx="19" ry="8" fill={shoe} stroke="none" />
          <ellipse cx="72" cy="-4" rx="19" ry="8" fill={shoe} stroke="none" />
        </g>
      ) : (
        <g stroke={bottom} strokeWidth="27" strokeLinecap="round" fill="none">
          <path d="M-14 -104 V -14" />
          <path d="M14 -104 V -14" />
          <ellipse cx="-18" cy="-5" rx="20" ry="8" fill={shoe} stroke="none" />
          <ellipse cx="18" cy="-5" rx="20" ry="8" fill={shoe} stroke="none" />
        </g>
      )}

      <g transform={`translate(0 ${drop})`}>
        {/* torso */}
        <path d="M-40 -186 Q-40 -202 -24 -202 H24 Q40 -202 40 -186 L34 -96 Q0 -88 -34 -96 Z" fill={top} />
        {/* neck + head */}
        <rect x="-8" y="-214" width="16" height="18" rx="6" fill={skin} />
        <ellipse cx="0" cy="-234" rx="24" ry="27" fill={skin} />
        {hairStyle !== "long" && <Hair style={hairStyle} color={hair} />}
        {hairStyle === "long" && (
          <path d="M-25 -240 Q-6 -256 24 -242 Q10 -262 -10 -262 Q-26 -258 -25 -240 Z" fill={hair} />
        )}

        {/* arms */}
        <g strokeLinecap="round" fill="none" stroke={top} strokeWidth="22">
          {pose === "point" && (
            <>
              <path d="M-36 -188 L -44 -122" />
              <path d="M36 -188 L 98 -226" />
            </>
          )}
          {pose === "reach" && (
            <>
              <path d="M-36 -188 L -70 -230" />
              <path d="M36 -188 L 70 -230" />
            </>
          )}
          {pose === "carry" && (
            <>
              <path d="M-36 -188 L -46 -120" />
              <path d="M36 -188 L 50 -124" />
            </>
          )}
          {pose === "sit" && (
            <>
              <path d="M-36 -188 L -20 -128 L 44 -118" />
              <path d="M36 -188 L 50 -132 L 96 -118" />
            </>
          )}
          {pose === "stand" && (
            <>
              <path d="M-36 -188 L -46 -118" />
              <path d="M36 -188 L 46 -118" />
            </>
          )}
        </g>
        <g fill={skin}>
          {pose === "point" && (
            <>
              <circle cx="-46" cy="-112" r="11" />
              <circle cx="104" cy="-229" r="11" />
            </>
          )}
          {pose === "reach" && (
            <>
              <circle cx="-73" cy="-235" r="11" />
              <circle cx="73" cy="-235" r="11" />
            </>
          )}
          {pose === "carry" && (
            <>
              <circle cx="-47" cy="-110" r="11" />
              <circle cx="52" cy="-114" r="11" />
            </>
          )}
          {pose === "sit" && (
            <>
              <circle cx="50" cy="-118" r="11" />
              <circle cx="102" cy="-118" r="11" />
            </>
          )}
          {pose === "stand" && (
            <>
              <circle cx="-47" cy="-111" r="11" />
              <circle cx="47" cy="-111" r="11" />
            </>
          )}
        </g>
        {accessory}
      </g>
    </g>
  );
};
