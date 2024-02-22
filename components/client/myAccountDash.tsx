import { useContext } from "react";
import { ClientContext } from "../../api/providers/clientProvider";
import useTranslation from "next-translate/useTranslation";

export default function MyAccountDash() {
  const { t, lang } = useTranslation("common");
  const { client } = useContext(ClientContext);

  if (!client) {
    return <div>...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start">
      <p>{client.client_info.firstName}</p>
    </div>
  );
}
