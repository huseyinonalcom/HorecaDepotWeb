export const rankFromRole = (role: string) => {
  switch (role) {
    case "Tier 9":
      return "admin";
    case "Tier 8":
      return "seller";
    case "Tier 7":
      return "warehouse-worker";
    case "Client":
      return "customer";
    default:
      return 0;
  }
};
