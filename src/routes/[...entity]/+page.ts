export function load({ data }) {
  if (data.entity.attributes?.header && typeof document !== 'undefined') {
    // Preload the header image
    new Image().src = data.entity.attributes.header;
  }

  return data;
}
