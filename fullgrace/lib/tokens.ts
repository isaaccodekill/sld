export const tokens = {
  color: {
    cream: "#F7F3EC",
    cream2: "#F1EADC",
    cream3: "#ECE2CF",
    ink: "#1F1B16",
    ink2: "#4A433B",
    ink3: "#8A8278",
    line: "#E3DACB",
    green: "#2F5D3A",
    green2: "#264B2F",
    green3: "#E6EEE7",
    puzzleBlue: "#2E6FC7",
    puzzleRed: "#D64438",
    puzzleYellow: "#F5C23A",
    puzzleGreen: "#2A8B3D",
    black: "#0B0A08",
  },
  radius: { sm: 4, md: 8, lg: 16, xl: 28 },
  motion: {
    ease: "cubic-bezier(.22, 1, .36, 1)",
    fast: 180,
    base: 420,
    slow: 720,
  },
} as const;

export type PuzzleColor = "blue" | "red" | "yellow" | "green";

export const puzzleHex: Record<PuzzleColor, string> = {
  blue: tokens.color.puzzleBlue,
  red: tokens.color.puzzleRed,
  yellow: tokens.color.puzzleYellow,
  green: tokens.color.puzzleGreen,
};
