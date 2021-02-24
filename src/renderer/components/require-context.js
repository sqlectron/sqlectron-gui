export const requireLogos = (item) =>
  require.context('./', false, /server-db-client-.*\.png$/)(item).default;
