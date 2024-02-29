import { useEffect } from "react";
import { AdminDrawerProvider } from "../../api/providers/adminDrawerProvider";
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
    <AdminDrawerProvider>
      <main>
        <div className="flex flex-row">
          <AdminDrawer />
          <div className="flex-1 overflow-x-hidden px-2">{children}</div>
        </div>
      </main>
    </AdminDrawerProvider>
  );
};

export default AdminLayout;
