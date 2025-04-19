import useTranslation from "next-translate/useTranslation";
import { Client } from "../../api/interfaces/client";
import { useEffect, useState } from "react";
import { Button } from "../styled/button";
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "../styled/pagination";

const fetchCustomers = async ({
  search,
  page,
}: {
  search: string;
  page: number;
}) => {
  const request = await fetch(
    `/api/private/customers?page=${page}${search != "" ? "&search=" + search : ""}`,
  );
  const data = await request.json();
  return data;
};

export const CustomerSelector = ({
  onCustomerSelected,
}: {
  onCustomerSelected: (customer: Client) => void;
}) => {
  const { t } = useTranslation("common");
  const [customers, setCustomers] = useState<Client[]>([]);
  const [filter, setFilter] = useState({
    search: "",
    page: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchCustomers({
      search: filter.search,
      page: filter.page,
    }).then((ans) => {
      setCustomers(ans.data);
      setFilter((currFilter) => ({
        ...currFilter,
        totalPages: ans.meta.pagination.pageCount,
      }));
    });
  }, [filter.page, filter.search]);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <h3 className="text-lg font-semibold">{t("customers")}</h3>
      <div className="mt-8 flow-root px-[1px] w-full">
        <div className="no-scrollbar -mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg sm:rounded-b-none">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      {t("name")}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {t("e-mail")}
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">{t("select")}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {customers.map((customer) => (
                    <tr key={customer.login?.role?.name + "-" + customer.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        {customer.firstName} {customer.lastName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {customer.email ?? customer.login?.email}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Button
                          type="button"
                          onClick={() => onCustomerSelected(customer)}
                        >
                          {t("select")}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Pagination className="border-1 sticky bottom-0 -mt-1 flex w-full rounded-lg rounded-t-none border-zinc-950/10 bg-white p-4">
        <PaginationPrevious
          onClick={
            filter.page > 1
              ? () => {
                  scroll({
                    top: 0,
                    behavior: "smooth",
                  });
                  setFilter({ ...filter, page: filter.page - 1 });
                }
              : undefined
          }
        >
          <p className="text-black">{t("previous")}</p>
        </PaginationPrevious>
        <PaginationList>
          <PaginationPage className="data-disabled:opacity-100">
            {filter.page}
          </PaginationPage>
        </PaginationList>
        <PaginationNext
          onClick={
            filter.page < filter.totalPages
              ? () => {
                  scroll({
                    top: 0,
                    behavior: "smooth",
                  });
                  setFilter({ ...filter, page: filter.page + 1 });
                }
              : undefined
          }
        >
          <p className="text-black">{t("next")}</p>
        </PaginationNext>
      </Pagination>
    </div>
  );
};
