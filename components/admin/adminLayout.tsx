import { useEffect } from "react";
import AdminDrawer from "./adminDrawer";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: Props) => {
  const router = useRouter();
  useEffect(() => {
    const validateSession = async () => {
      const data = await fetch("/api/admin/checkloggedinuser");

      if (data.status != 200) {
        router.push("/admin");
      }
    };
    validateSession();
  }, []);

    return (
      <main>
        <div className="flex flex-row">
          <AdminDrawer />
          <div className="flex-shrink-1 overflow-x-hidden px-2">{children}</div>
        </div>
      </main>
  );
};

export default AdminLayout;
