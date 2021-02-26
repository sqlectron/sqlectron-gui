export const requireClientLogo = (item) =>
  require.context('../assets/server-db-client', false, /.*\.png$/)(`./${item}.png`).default;
