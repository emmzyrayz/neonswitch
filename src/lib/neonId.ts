export function generateNeonId() {
  return (
    "NEON-" +
    Math.random().toString(36).substring(2, 6).toUpperCase() +
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
}
