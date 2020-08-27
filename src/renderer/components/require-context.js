export const requireLogos = ((item) => {
  return require.context('./', false, /server-db-client-.*\.png$/)(item).default;
});
