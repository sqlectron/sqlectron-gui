export default function wait(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}
