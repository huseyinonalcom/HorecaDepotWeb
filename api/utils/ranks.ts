export const rankFromRole = (role: string) => {
  switch (role) {
    case "Tier 9":
      return "admin";
    case "Tier 8":
      return "seller";
    case "Tier 7":
      return "seller";
    case "client":
      return "customer";
    default:
      return 0;
  }
};
