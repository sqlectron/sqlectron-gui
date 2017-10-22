const getCurrentServerId = state => {
  try {
    const { servers: { items } } = state;
    const currentServerId = state.connections.server.id;

    return items.find(({ id }) => id === currentServerId).id;
  } catch (err) {
    return '';
  }
};

export default getCurrentServerId;
