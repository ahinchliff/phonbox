export const truncateString = (
  address: string,
  startChars: number = 6,
  endChars: number = 4
) => {
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

export const getCardDisplayName = (cardDetails: phonbox.CardDetails) =>
  cardDetails.friendlyName || truncateString(cardDetails.publicKey, 5, 5);
