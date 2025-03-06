export const rankFromRole = (role: string) => {
  switch (role) {
    case "Tier 9":
      return "admin";
    case "Tier 8":
      return "vendeur";
    case "Tier 7":
      return "vendeur";
    case "client":
      return "customer";
    default:
      return 0;
  }
};
