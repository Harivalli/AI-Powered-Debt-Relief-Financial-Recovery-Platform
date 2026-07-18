export default function ClimbLine({ width = 460, height = 140, stroke = '#c99a3d' }) {
  return (
    <svg
      className="climb-line"
      width={width}
      height={height}
      viewBox="0 0 460 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 120 C 40 122, 70 108, 100 100 C 140 90, 160 60, 200 55 C 240 50, 250 78, 290 65 C 330 52, 340 20, 380 15 C 410 11, 430 18, 460 5"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="460" cy="5" r="4.5" fill={stroke} />
    </svg>
  );
}
