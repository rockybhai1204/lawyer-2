"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { ApiFormResponse } from "@/types/api/forms";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TableExportDropdown } from "@/components/ui/table-export-dropdown";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

const Page = () => {
  const [responses, setResponses] = useState<ApiFormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [formId, setFormId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const res = await fetch(
        "/api/admin/forms/type/LAWYER_REGISTRATION/responses"
      );
      if (res.ok) {
        const data = await res.json();
        setResponses(data);
        // Get the form ID from the first response for routing
        if (data.length > 0) {
          setFormId(data[0].formId);
        }
      }
      setLoading(false);
    };
    run();
  }, []);

  const columns: ColumnDef<ApiFormResponse>[] = [
    {
      id: "createdAt",
      accessorKey: "createdAt",
      sortingFn: (a, b) =>
        new Date(a.original.createdAt).getTime() - new Date(b.original.createdAt).getTime(),
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <button
            className="text-blue-800"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date & Time
          </button>
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5 text-blue-700" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5 text-blue-700" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 text-blue-600" />
          )}
        </div>
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </div>
          <div className="text-sm text-blue-600">
            {new Date(row.original.createdAt).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      id: "surveyInfo",
      header: () => <span className="text-blue-800">Survey Info</span>,
      enableSorting: false,
      cell: () => (
        <div className="text-sm text-blue-700">
          <div className="font-medium">Lawyer Registration</div>
          <div className="text-xs text-blue-600">Registration inquiry</div>
        </div>
      ),
    },
    {
      id: "actions",
      enableSorting: false,
      header: () => <div className="text-right text-blue-800">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {formId && (
            <Link href={`/admin/forms/${formId}/responses/${row.original.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Response
              </Button>
            </Link>
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: responses,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  const headerLabels = { createdAt: "Date & Time", surveyInfo: "Survey Info" } as const;
  const valueFormatter = (row: ApiFormResponse, colId: string, ctx: "csv" | "pdf") => {
    if (colId === "createdAt") {
      const formatted = new Date(row.createdAt).toISOString().slice(0, 19).replace("T", " ");
      return ctx === "csv" ? `'${formatted}` : formatted;
    }
    if (colId === "surveyInfo") return "Lawyer Registration - Registration inquiry";
    return (row as any)[colId] ?? "";
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Lawyer Inquiries
            </h1>
            <p className="text-blue-700">
              View and manage lawyer registration submissions
            </p>
          </div>
        </div>

        {/* Responses Card */}
        <div className="border border-blue-100 bg-white/90 backdrop-blur rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-blue-800">
                  Responses ({responses.length})
                </h2>
                <p className="text-blue-700 text-sm">
                  Lawyer registration form submissions and details
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-blue-700">
                Showing {table.getRowModel().rows.length} of {responses.length}
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-100">Columns</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table.getAllLeafColumns().filter((c) => c.id !== "actions").map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <TableExportDropdown
                  table={table}
                  fileBaseName="lawyer-inquiries"
                  headerLabels={headerLabels}
                  valueFormatter={valueFormatter}
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-blue-100">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className={header.column.id === "actions" ? "text-right text-blue-800" : "text-blue-800"}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow className="hover:bg-blue-50/60">
                    <TableCell
                      colSpan={table.getAllLeafColumns().length}
                      className="text-center py-8 text-blue-700"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        Loading responses...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : responses.length === 0 ? (
                  <TableRow className="hover:bg-blue-50/60">
                    <TableCell
                      colSpan={table.getAllLeafColumns().length}
                      className="text-center py-8 text-blue-700"
                    >
                      No responses yet
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-blue-50/60 transition-colors border-blue-100">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className={cell.column.id === "actions" ? "text-right" : undefined}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {responses.length > 0 && (
              <Pagination className="justify-end mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        table.previousPage();
                      }}
                      aria-disabled={!table.getCanPreviousPage()}
                      className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                  {Array.from({ length: table.getPageCount() }).map((_, idx) => (
                    <PaginationItem key={idx}>
                      <PaginationLink
                        href="#"
                        isActive={table.getState().pagination.pageIndex === idx}
                        onClick={(e) => {
                          e.preventDefault();
                          table.setPageIndex(idx);
                        }}
                      >
                        {idx + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        table.nextPage();
                      }}
                      aria-disabled={!table.getCanNextPage()}
                      className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
