export const requireClientLogo = (item: string) =>
  require.context('../assets/server-db-client', false, /.*\.png$/)(`./${item}.png`).default;
