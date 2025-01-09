import { ChevronLeft } from "react-feather";

export const Paging = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const getPageNumbers = () => {
    let pages = [];
    let startPage, endPage;

    if (totalPages <= 6) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (Number(currentPage) <= 4) {
        startPage = 1;
        endPage = 5;
      } else if (Number(currentPage) + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = Number(currentPage) - 2;
        endPage = Number(currentPage) + 2;
      }
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mb-4 flex flex-row justify-center px-6">
      <div className="mt-2">
        <div className="flex items-center justify-center space-x-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="border p-2 hover:bg-gray-200"
            aria-label="Previous page"
          >
            <ChevronLeft />
          </button>
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={index} className="p-2">
                ...
              </span>
            ) : (
              <button
                key={index}
                className={`border p-2 hover:bg-gray-200 ${currentPage == page && "bg-gray-300"}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ),
          )}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="border p-2 hover:bg-gray-200"
            aria-label="Next page"
          >
            <ChevronLeft className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
