import { useEffect, useRef } from "react";
import { utils, write } from "xlsx";
import { getCustomers } from "../api/private/customers";

type CustomersPayload = any;

type CustomersExportProps = {
  allCustomersQuick: CustomersPayload;
};

const normaliseCustomers = (customers: CustomersPayload) => {
  const rawList = Array.isArray(customers)
    ? customers
    : Array.isArray(customers?.data)
      ? customers.data
      : [];

  return rawList.map((entry: any) => {
    const customer = entry?.attributes ?? entry ?? {};
    const login = customer?.login?.data?.attributes ?? customer?.login ?? {};

    return {
      firstName: customer?.firstName ?? "",
      lastName: customer?.lastName ?? "",
      company: customer?.company ?? "",
      taxId: customer?.taxId ?? customer?.taxID ?? "",
      phone: customer?.phone ?? "",
      email: login?.email ?? customer?.email ?? "",
    };
  });
};

const generateXlsx = async ({ customers }: { customers: CustomersPayload }) => {
  const customersToWrite = normaliseCustomers(customers);

  if (customersToWrite.length === 0) {
    return;
  }

  const s2ab = (s: string) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  const now = new Date();
  const timestamp =
    now.getFullYear() +
    "_" +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    "_" +
    now.getDate().toString().padStart(2, "0") +
    "_" +
    now.getHours().toString().padStart(2, "0") +
    "_" +
    now.getMinutes().toString().padStart(2, "0");
  const wb = utils.book_new();

  const worksheet = utils.json_to_sheet(
    customersToWrite.map((customer) => {
      return {
        nom: `${customer.firstName} ${customer.lastName}`.trim(),
        entreprise: customer.company ?? "",
        TVA: customer.taxId ?? "",
        tel: customer.phone ?? "",
        email: customer.email ?? "",
      };
    }),
  );

  const rangeRef = worksheet["!ref"];
  if (rangeRef) {
    const range = utils.decode_range(rangeRef);

    worksheet["!rows"] = Array.from({ length: range.e.r + 1 }, (_, idx) => {
      return { hpt: 24 };
    });

    worksheet["!cols"] = Array.from({ length: range.e.c + 1 }, (_, idx) => {
      return { wpx: 120 };
    });
  }

  utils.book_append_sheet(wb, worksheet);

  const wbout = write(wb, { bookType: "xlsx", type: "binary" });

  const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.href = url;
  a.download = timestamp + ".xlsx";
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
    if (a.parentNode) {
      a.parentNode.removeChild(a);
    }
  }, 0);
};

const CustomersExportPage = ({ allCustomersQuick }: CustomersExportProps) => {
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (hasTriggeredRef.current) {
      return;
    }
    hasTriggeredRef.current = true;

    const triggerDownload = async () => {
      try {
        await generateXlsx({ customers: allCustomersQuick });
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error("Failed to generate customers export", error);
      } finally {
        try {
          window.close();
        } catch (err) {
          console.error("Unable to close export window", err);
        }

        setTimeout(() => {
          if (!window.closed) {
            window.location.replace("/admin/users");
          }
        }, 700);
      }
    };

    void triggerDownload();
  }, [allCustomersQuick]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-gray-700">
      <p>Generating customers export...</p>
    </div>
  );
};

export default CustomersExportPage;

export async function getServerSideProps(context) {
  const req = context.req;
  const allCustomersQuick = await getCustomers({
    count: 1000,
    authToken: req.cookies.j,
  });
  return {
    props: {
      allCustomersQuick,
    },
  };
}
