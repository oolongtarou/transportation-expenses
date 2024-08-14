import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination";
import { calculateTotalPages, existsNextPage, existsPrevPage, } from "@/lib/pagination";

type CustomPaginationProps = {
    total: number;
    currentPage: number;
    itemsPerPage: number;
};

export const CustomPagination = (props: CustomPaginationProps) => {
    const { total, currentPage, itemsPerPage } = props;
    const totalPage = calculateTotalPages(itemsPerPage, total);

    // ページ番号の配列を生成
    const pageNumbers = Array.from({ length: totalPage }, (_, i) => i + 1);

    return (
        <Pagination className="my-5">
            <PaginationContent>
                <PaginationItem hidden={!existsPrevPage(currentPage)}>
                    <PaginationPrevious />
                </PaginationItem>

                {/* 前後2ページずつを表示 */}
                {pageNumbers.map((pageNumber) => {
                    if (
                        Math.abs(pageNumber - currentPage) <= 2 ||
                        (currentPage <= 2 && pageNumber <= 5) ||
                        (currentPage >= totalPage - 1 && pageNumber >= totalPage - 4)
                    ) {
                        return (
                            <PaginationItem key={pageNumber}>
                                <PaginationLink
                                    className={currentPage === pageNumber ? "active" : ""}
                                >
                                    {pageNumber}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    } else {
                        return null;
                    }
                })}

                <PaginationItem hidden={!existsNextPage(currentPage, totalPage)}>
                    <PaginationNext />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default Pagination;
