import { useRouter } from "next/router";
import AdminDrawer from "./adminDrawer";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const router = useRouter();
  useEffect(() => {
    const validateSession = async () => {
      const data = await fetch("/api/private/auth/checkloggedinuser");
      const answer = await data.json();
      if (data.status == 200) {
        if (answer.role != "Tier 9") {
          router.push("/stock/list/all");
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
        <AdminDrawer />
        <div className="flex-shrink-1 w-full overflow-x-hidden px-2">
          {children}
        </div>
      </div>
    </main>
  );
}
