import { useRouter } from "next/router";
import AdminDrawer from "./adminDrawer";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const router = useRouter();
  const [userTier, setUserTier] = useState(8);
  useEffect(() => {
    const validateSession = async () => {
      const data = await fetch("/api/private/auth/checkloggedinuser");
      const answer = await data.json();
      console.log(answer);
      if (data.status == 200) {
        if (answer.role != "Tier 9" && answer.role != "Tier 8") {
          router.push("/stock/list/all");
        } else {
          setUserTier(Number(answer.role.replaceAll("Tier ", "")));
        }
      } else {
        router.push("/admin");
      }
    };
    validateSession();
  }, []);

  return (
    <main>
      <div className="flex flex-row">
        <AdminDrawer userTier={userTier} />
        <div className="flex-shrink-1 w-full overflow-x-hidden px-2">
          {children}
        </div>
      </div>
    </main>
  );
}
