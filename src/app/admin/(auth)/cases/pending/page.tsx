"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ApiCase } from "@/types/api/cases";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { LawyerResponse, GetLawyersResponse } from "@/types/api/lawyers";
import { ApiService, ServicesResponse } from "@/types/api/services";
import { DateRangePicker } from "@/components/ui/date-picker-2";
import { format } from "date-fns";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableExportDropdown } from "@/components/ui/table-export-dropdown";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export default function AdminCasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState<ApiCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");

  const [updatingIndividualNotification, setUpdatingIndividualNotification] =
    useState<string | null>(null);
  const [unassignedOnly, setUnassignedOnly] = useState<boolean>(false);
  const [notificationFilter, setNotificationFilter] = useState<
    "all" | "on" | "off"
  >("all");
  const [selectedLawyerId, setSelectedLawyerId] = useState<string>("all");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"createdAtDesc" | "createdAtAsc">(
    "createdAtDesc"
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lawyers, setLawyers] = useState<LawyerResponse[]>([]);
  const [services, setServices] = useState<ApiService[]>([]);
  const [dateRange, setDateRange] = useState<
    | {
        from: Date;
        to: Date;
      }
    | undefined
  >();

  // TanStack table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    fetchCases();
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    // Set default dates to last 7 days
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    setDateRange({
      from: lastWeek,
      to: today,
    });
  }, []);

  const fetchCases = async () => {
    try {
      const response = await fetch("/api/admin/cases");
      if (response.ok) {
        const data = await response.json();
        setCases(data.data || []);
      } else {
        toast.error("Failed to fetch cases");
      }
    } catch (error) {
      console.error("Error fetching cases:", error);
      toast.error("Failed to fetch cases");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const [lawyersRes, servicesRes] = await Promise.all([
        fetch("/api/admin/lawyers"),
        fetch("/api/admin/services"),
      ]);

      if (lawyersRes.ok) {
        const data: GetLawyersResponse = await lawyersRes.json();
        setLawyers(data.lawyers || []);
      }

      if (servicesRes.ok) {
        const data: ServicesResponse = await servicesRes.json();
        setServices(data.data || []);
      }
    } catch (error) {
      // ignore
    }
  };

  const handleIndividualNotificationToggle = async (
    caseId: string,
    currentValue: boolean
  ) => {
    setUpdatingIndividualNotification(caseId);
    try {
      const response = await fetch(`/api/admin/cases/${caseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isAutoNotificationOn: !currentValue,
        }),
      });

      if (response.ok) {
        toast.success(
          `Notifications ${
            !currentValue ? "enabled" : "disabled"
          } for this case`
        );
        await fetchCases(); // Refresh the cases to get updated notification settings
      } else {
        toast.error("Failed to update notification settings");
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast.error("Failed to update notification settings");
    } finally {
      setUpdatingIndividualNotification(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredCases = useMemo(() => {
    const list = cases.filter((caseItem) => {
      const matchesSearch =
        caseItem.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        caseItem.customerEmail
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (caseItem.service?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || caseItem.status === statusFilter;

      const matchesUnassigned = !unassignedOnly || !caseItem.lawyerId;

      const matchesNotification =
        notificationFilter === "all" ||
        (notificationFilter === "on" && caseItem.isAutoNotificationOn) ||
        (notificationFilter === "off" && !caseItem.isAutoNotificationOn);

      const matchesLawyer =
        selectedLawyerId === "all" || caseItem.lawyer?.id === selectedLawyerId;

      const matchesService =
        selectedServiceId === "all" ||
        caseItem.service?.id === selectedServiceId;

      const matchesDateRange =
        !dateRange?.from ||
        !dateRange?.to ||
        (new Date(caseItem.createdAt) >= dateRange.from &&
          new Date(caseItem.createdAt) <= dateRange.to);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesUnassigned &&
        matchesNotification &&
        matchesLawyer &&
        matchesService &&
        matchesDateRange
      );
    });

    list.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      if (sortBy === "createdAtAsc") return aTime - bTime;
      return bTime - aTime;
    });

    return list;
  }, [
    cases,
    searchTerm,
    statusFilter,
    unassignedOnly,
    notificationFilter,
    selectedLawyerId,
    selectedServiceId,
    sortBy,
    dateRange,
  ]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredCases.length / pageSize));

  // TanStack columns
  const columns = useMemo<ColumnDef<ApiCase>[]>(
    () => [
      {
        id: "rowIndex",
        header: "#",
        enableSorting: false,
        cell: ({ row }) => {
          const rowNumber = (currentPage - 1) * pageSize + row.index + 1;
          return <span className="font-medium text-blue-900">{rowNumber}</span>;
        },
      },
      {
        id: "customer",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="px-0 gap-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Customer
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-3.5 w-3.5" />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
        ),
        sortingFn: (a, b) =>
          a.original.customerName.localeCompare(b.original.customerName),
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-blue-900">{row.original.customerName}</div>
            <div className="text-sm text-blue-700/80">{row.original.customerEmail}</div>
            <div className="text-sm text-blue-700/80">{row.original.customerPhone}</div>
          </div>
        ),
      },
      {
        id: "service",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="px-0 gap-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Service
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-3.5 w-3.5" />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
        ),
        sortingFn: (a, b) =>
          (a.original.service?.name || "").localeCompare(b.original.service?.name || ""),
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-blue-900">{row.original.service?.name}</div>
            <div className="text-sm text-blue-700/80">{row.original.service?.category?.name}</div>
          </div>
        ),
      },
      {
        id: "status",
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
        sortingFn: (a, b) => a.original.status.localeCompare(b.original.status),
        cell: ({ row }) => (
          <Badge className={getStatusColor(row.original.status)}>
            {row.original.status.replace("_", " ")}
          </Badge>
        ),
      },
      {
        id: "lawyer",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="px-0 gap-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Lawyer
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-3.5 w-3.5" />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
        ),
        sortingFn: (a, b) =>
          (a.original.lawyer?.name || "").localeCompare(b.original.lawyer?.name || ""),
        cell: ({ row }) =>
          row.original.lawyer ? (
            <div>
              <div className="font-medium">{row.original.lawyer.name}</div>
              <div className="text-sm text-blue-700/80">{row.original.lawyer.email}</div>
            </div>
          ) : (
            <span className="text-blue-400">Not assigned</span>
          ),
      },
      {
        id: "notifications",
        header: "Notifications",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Switch
              checked={row.original.isAutoNotificationOn}
              onCheckedChange={() =>
                handleIndividualNotificationToggle(
                  row.original.id,
                  row.original.isAutoNotificationOn
                )
              }
              disabled={updatingIndividualNotification === row.original.id}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className="text-sm text-blue-700">
              {updatingIndividualNotification === row.original.id
                ? "Updating..."
                : row.original.isAutoNotificationOn
                ? "On"
                : "Off"}
            </span>
          </div>
        ),
      },
      {
        id: "createdAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="px-0 gap-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-3.5 w-3.5" />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
        ),
        sortingFn: (a, b) =>
          new Date(a.original.createdAt).getTime() -
          new Date(b.original.createdAt).getTime(),
        cell: ({ row }) => (
          <span className="text-sm text-blue-700">{formatDate(row.original.createdAt)}</span>
        ),
      },
      {
        id: "actions",
        enableSorting: false,
        header: () => <div className="text-left">Actions</div>,
        cell: ({ row }) => (
          <Button
            onClick={() => router.push(`/admin/cases/${row.original.id}`)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            View Details
          </Button>
        ),
      },
    ],
    [currentPage, router, updatingIndividualNotification]
  );

  const table = useReactTable({
    data: filteredCases,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const sortedRows = table.getRowModel().rows;
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    unassignedOnly,
    notificationFilter,
    selectedLawyerId,
    selectedServiceId,
    sortBy,
    dateRange,
  ]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cases...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-blue-50">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Pending Cases
            </h1>
            <p className="text-blue-700">
              Manage and track all pending customer cases
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6 border border-blue-100 bg-white/90 backdrop-blur">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Date Range
              </label>
              <DateRangePicker
                onUpdate={(values) => {
                  if (values.range.from && values.range.to) {
                    setDateRange({
                      from: values.range.from,
                      to: values.range.to,
                    });
                  }
                }}
                initialDateFrom={dateRange?.from}
                initialDateTo={dateRange?.to}
                align="start"
                locale="en-GB"
                showCompare={false}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Search Cases
              </label>
              <Input
                placeholder="Search pending cases by customer name, email, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-blue-200 focus-visible:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Notification
              </label>
              <Select
                value={notificationFilter}
                onValueChange={(v) => setNotificationFilter(v as any)}
              >
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="border-blue-200 [&_[data-slot=select-item]:focus]:bg-blue-600 [&_[data-slot=select-item]:focus]:text-white">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="on">On</SelectItem>
                  <SelectItem value="off">Off</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder="Newest" />
                </SelectTrigger>
                <SelectContent className="border-blue-200 [&_[data-slot=select-item]:focus]:bg-blue-600 [&_[data-slot=select-item]:focus]:text-white">
                  <SelectItem value="createdAtDesc">Newest</SelectItem>
                  <SelectItem value="createdAtAsc">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Lawyer
              </label>
              <Select
                value={selectedLawyerId}
                onValueChange={setSelectedLawyerId}
              >
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder="All lawyers" />
                </SelectTrigger>
                <SelectContent className="border-blue-200 [&_[data-slot=select-item]:focus]:bg-blue-600 [&_[data-slot=select-item]:focus]:text-white">
                  <SelectItem value="all">All Lawyers</SelectItem>
                  {lawyers.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Service
              </label>
              <Select
                value={selectedServiceId}
                onValueChange={setSelectedServiceId}
              >
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue placeholder="All services" />
                </SelectTrigger>
                <SelectContent className="border-blue-200 [&_[data-slot=select-item]:focus]:bg-blue-600 [&_[data-slot=select-item]:focus]:text-white">
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-blue-700">Unassigned only</span>
                <Switch
                  checked={unassignedOnly}
                  onCheckedChange={(v) => setUnassignedOnly(!!v)}
                  aria-label="Filter unassigned cases"
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases Table Toolbar */}
      <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
        <div className="text-sm text-blue-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">Columns</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllLeafColumns()
                .filter((c) => c.id !== "actions" && c.id !== "rowIndex")
                .map((column) => (
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
        </div>
        <TableExportDropdown
          table={table}
          fileBaseName="pending-cases"
          headerLabels={{
            rowIndex: "#",
            customer: "Customer",
            service: "Service",
            status: "Status",
            lawyer: "Lawyer",
            notifications: "Notifications",
            createdAt: "Created",
          }}
          valueFormatter={(row, colId) => {
            const c = row as ApiCase;
            switch (colId) {
              case "customer":
                return `${c.customerName} | ${c.customerEmail} | ${c.customerPhone ?? ""}`;
              case "service":
                return `${c.service?.name ?? ""} | ${c.service?.category?.name ?? ""}`;
              case "status":
                return c.status;
              case "lawyer":
                return c.lawyer ? `${c.lawyer.name} | ${c.lawyer.email}` : "Not assigned";
              case "notifications":
                return c.isAutoNotificationOn ? "On" : "Off";
              case "createdAt":
                return formatDate(c.createdAt);
              default:
                return "";
            }
          }}
        />
      </div>

      {/* Cases Table */}
      <Card className="border border-blue-100 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle>Pending Cases ({filteredCases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b">
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="text-left py-3 px-4 font-semibold text-blue-800">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-blue-50/60 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3 px-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCases.length === 0 && (
              <div className="text-center py-8">
                <p className="text-blue-700/80">No pending cases found</p>
              </div>
            )}
          </div>
          {filteredCases.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-blue-700">
                Showing {(currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, sortedRows.length)} of {sortedRows.length}
              </div>
              {totalPages > 1 && (
                <div
                  className="flex items-center gap-2"
                  role="navigation"
                  aria-label="Pagination"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    aria-label="First page"
                    className="border-blue-200 text-blue-700 hover:bg-blue-100"
                  >
                    First
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Button
                        key={p}
                        variant={p === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(p)}
                        aria-current={p === currentPage ? "page" : undefined}
                        aria-label={`Page ${p}`}
                        className={
                          p === currentPage
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "border-blue-200 text-blue-700 hover:bg-blue-100"
                        }
                      >
                        {p}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="Last page"
                    className="border-blue-200 text-red -700 hover:bg-blue-100"
                  >
                    Last
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
