"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Inbox, ChevronLeft, ChevronRight } from "lucide-react";

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface AdminDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  searchPlaceholder?: string;
  searchValue?: string;
  emptyMessage?: string;
}

export function AdminDataTable<T extends { id: string | number }>({
  data,
  columns,
  totalCount,
  currentPage,
  pageSize,
  searchPlaceholder = "Search...",
  searchValue = "",
  emptyMessage = "No records found.",
}: AdminDataTableProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = React.useState(searchValue);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Sync query params
  const updateQuery = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      Object.entries(params).forEach(([key, val]) => {
        if (val === null || val === "" || val === 1 && key === "page") {
          current.delete(key);
        } else {
          current.set(key, String(val));
        }
      });
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${pathname}${query}`);
    },
    [router, pathname, searchParams]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ search: searchTerm.trim(), page: 1 });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="flex max-w-sm flex-1 items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
          {searchParams.get("search") && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                updateQuery({ search: null, page: 1 });
              }}
            >
              Reset
            </Button>
          )}
        </form>
        <div className="text-xs text-muted-foreground">
          Showing <span className="font-medium text-foreground">{data.length}</span> of{" "}
          <span className="font-medium text-foreground">{totalCount}</span> results
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead key={idx} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="size-6 text-muted-foreground/60" />
                    <span>{emptyMessage}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col, idx) => (
                    <TableCell key={idx} className={col.className}>
                      {col.cell
                        ? col.cell(row)
                        : col.accessorKey
                        ? String(row[col.accessorKey] ?? "")
                        : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Server Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between py-2">
          <div className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => updateQuery({ page: currentPage - 1 })}
            >
              <ChevronLeft className="size-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => updateQuery({ page: currentPage + 1 })}
            >
              Next
              <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
