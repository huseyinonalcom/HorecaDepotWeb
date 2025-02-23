import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const router = useRouter();

  const validateSession = async () => {
    const data = await fetch("/api/admin/checkloggedinuser");
    if (data.status != 200) {
      router.push("/admin");
    }
  };

  useEffect(() => {
    validateSession();
  }, []);

  return (
    <main>
      <div className="flex flex-row">
        <div className="flex-shrink-0 p-2">
          <div className="flex w-full flex-col"></div>
        </div>
        <div className="flex-shrink-1 w-full p-2">{children}</div>
      </div>
    </main>
  );
}
