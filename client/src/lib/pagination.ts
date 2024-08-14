export function existsPrevPrevPage(currentPage: number): boolean {
    return currentPage > 2;
}

export function existsPrevPage(currentPage: number): boolean {
    return currentPage > 1;
}

export function existsNextPage(currentPage: number, totalPage: number): boolean {
    return totalPage - currentPage >= 1;
}

export function existsNextNextPage(currentPage: number, totalPage: number): boolean {
    return totalPage - currentPage >= 2;
}


export function calculateTotalPages(itemsPerPage: number, totalItems: number): number {
    if (itemsPerPage <= 0) {
        throw new Error("itemsPerPage must be greater than 0");
    }
    return Math.ceil(totalItems / itemsPerPage);
}
