export const rankFromRole = (role: string) => {
  switch (role) {
    case "Tier 9":
      return "admin";
    case "Tier 8":
      return "";
    case "client":
      return 3;
    default:
      return 0;
  }
};
