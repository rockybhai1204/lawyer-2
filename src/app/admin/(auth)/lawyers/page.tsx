"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Phone,
  Mail,
  Users,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { GetLawyersResponse, LawyerResponse } from "@/types/api/lawyers";
import { Skeleton } from "@/components/ui/skeleton";
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

const LawyersPage = () => {
  const router = useRouter();
  const [lawyers, setLawyers] = useState<LawyerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("");
  const [excelLoading, setExcelLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const fetchLawyers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search,
        ...(isActiveFilter && { isActive: isActiveFilter }),
      });

      const response = await fetch(`/api/admin/lawyers?${params}`);
      const data: GetLawyersResponse = await response.json();

      if (response.ok) {
        setLawyers(data.lawyers);
      } else {
        toast.error("Failed to fetch lawyers");
      }
    } catch (error) {
      toast.error("Failed to fetch lawyers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, [search, isActiveFilter]);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleDownloadExcel = async () => {
    setExcelLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        ...(isActiveFilter && { isActive: isActiveFilter }),
      });
      const url = `/api/admin/lawyers/export?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        toast.error("Failed to download Excel");
        return;
      }
      const blob = await response.blob();
      const href = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.download = "lawyers_export.xlsx";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(href);
    } catch (error) {
      toast.error("Failed to download Excel");
    } finally {
      setExcelLoading(false);
    }
  };

  // TanStack Table setup
  const columns: ColumnDef<LawyerResponse>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {row.original.name.charAt(0).toUpperCase()}
            </span>
          </div>
          {row.original.name}
        </div>
      ),
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Mail className="w-3 h-3 text-muted-foreground" />
          {row.original.email}
        </div>
      ),
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        row.original.phone ? (
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-muted-foreground" />
            {row.original.phone}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      ),
    },
    {
      id: "experience",
      accessorKey: "experience",
      sortingFn: (a, b) => (a.original.experience || 0) - (b.original.experience || 0),
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Experience
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <span>{row.original.experience ? `${row.original.experience} years` : "-"}</span>
      ),
    },
    {
      id: "specialization",
      accessorKey: "specialization",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Specializations
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      ),
      sortingFn: (a, b) => (a.original.specialization?.length || 0) - (b.original.specialization?.length || 0),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.specialization.slice(0, 2).map((spec, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">{spec}</Badge>
          ))}
          {row.original.specialization.length > 2 && (
            <Badge variant="outline" className="text-xs">+{row.original.specialization.length - 2}</Badge>
          )}
        </div>
      ),
    },
    {
      id: "isActive",
      accessorKey: "isActive",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      ),
      sortingFn: (a, b) => Number(a.original.isActive) - Number(b.original.isActive),
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "cases",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cases
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      ),
      accessorFn: (row) => row.cases.length,
      cell: ({ row }) => <span className="text-sm font-medium">{row.original.cases.length}</span>,
    },
    {
      id: "actions",
      enableSorting: false,
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/lawyers/${row.original.id}`)}
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-700"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/lawyers/${row.original.id}/edit`)}
            className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-700"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: lawyers,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  const headerLabels = {
    name: "Name",
    email: "Email",
    phone: "Phone",
    experience: "Experience",
    specialization: "Specializations",
    isActive: "Status",
    cases: "Cases",
  } as const;

  const valueFormatter = (row: LawyerResponse, colId: string, ctx: "csv" | "pdf") => {
    if (colId === "isActive") return row.isActive ? "Active" : "Inactive";
    if (colId === "specialization") return row.specialization.join(", ");
    if (colId === "experience") return row.experience ? `${row.experience}` : "";
    if (colId === "cases") return String(row.cases.length);
    if (colId === "phone") {
      const phone = row.phone ?? "";
      return ctx === "csv" ? `'${String(phone)}` : String(phone);
    }
    return (row as any)[colId] ?? "";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lawyers</h1>
          <p className="text-gray-600 mt-1">Manage all lawyers in the system</p>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button
            onClick={handleDownloadExcel}
            variant="outline"
            className="shadow-sm"
            disabled={excelLoading}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Excel
          </Button> */}
          <Button
            onClick={() => router.push("/admin/lawyers/create")}
            className="shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lawyer
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-0">
        <CardHeader className="bg-white border-b">
          <CardTitle className="text-lg font-semibold">
            Manage Lawyers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search lawyers by name, email, or phone..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <select
              value={isActiveFilter}
              onChange={(e) => {
                setIsActiveFilter(e.target.value);
              }}
              className="px-3 py-2 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {loading ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Specializations</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cases</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-8 h-8 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-8" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : lawyers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Users className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-600 font-medium">No lawyers found</p>
              <p className="text-gray-500 text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Showing {table.getRowModel().rows.length} of {lawyers.length}</div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">Columns</Button>
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
                    fileBaseName="lawyers"
                    headerLabels={headerLabels}
                    valueFormatter={valueFormatter}
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className={header.column.id === "actions" ? "text-right" : undefined}>
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-muted/50">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className={cell.column.id === "actions" ? "text-right" : undefined}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Pagination>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LawyersPage;
