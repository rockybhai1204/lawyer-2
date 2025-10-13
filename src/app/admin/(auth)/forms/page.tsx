"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ApiForm, FormType } from "@/types/api/forms";
import {
  Pencil,
  Eye,
  MessageSquare,
  Trash2,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
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
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [forms, setForms] = useState<ApiForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<ApiForm | null>(null);
  const [formDetails, setFormDetails] = useState<{
    associatedServices: Array<{
      id: string;
      name: string;
      categoryName: string;
      formId: string | null;
    }>;
    responsesCount: number;
  } | null>(null);
  const [allForms, setAllForms] = useState<ApiForm[]>([]);
  const [serviceFormUpdates, setServiceFormUpdates] = useState<
    Record<string, string>
  >({});

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const pageSize = 10;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const [formsRes, allFormsRes] = await Promise.all([
        fetch("/api/admin/forms"),
        fetch("/api/admin/forms"),
      ]);

      const formsData = await formsRes.json();
      const allFormsData = await allFormsRes.json();

      setForms(formsData);
      setAllForms(allFormsData);
      setLoading(false);
    };
    run();
  }, []);

  // Filter forms (memoized)
  const filteredForms = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return forms.filter((form) => {
      const matchesSearch =
        form.name.toLowerCase().includes(lower) ||
        form.description?.toLowerCase().includes(lower) ||
        form.type.toLowerCase().includes(lower);
      const matchesType = typeFilter === "all" || form.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [forms, searchTerm, typeFilter]);

  // TanStack columns (memoized)
  const columns = useMemo<ColumnDef<ApiForm>[]>(
    () => [
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
        <div className="space-y-1">
          <div className="font-medium text-blue-900">{row.original.name}</div>
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <Badge variant="outline" className="text-xs px-1 py-0 border-blue-200">
              {row.original.type.replace("_", " ")}
            </Badge>
            <span className="text-blue-500">•</span>
            <span>{row.original.associatedServices.length} services</span>
            <span className="text-blue-500">•</span>
            <span>{row.original.responsesCount} responses</span>
          </div>
        </div>
      ),
    },
    {
      id: "description",
      accessorKey: "description",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
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
        <span className="max-w-[420px] truncate text-blue-700/80 inline-block">
          {row.original.description}
        </span>
      ),
    },
    {
      id: "type",
      accessorKey: "type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
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
        <TypeDropdown
          value={row.original.type}
          disabled={deletingId === row.original.id || updatingId === row.original.id}
          onChange={(t) => handleTypeChange(row.original.id, t)}
        />
      ),
    },
    {
      id: "responsesCount",
      accessorKey: "responsesCount",
      sortingFn: (a, b) => (a.original.responsesCount || 0) - (b.original.responsesCount || 0),
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Responses
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.responsesCount}</span>,
    },
    {
      id: "servicesCount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Services
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      ),
      accessorFn: (row) => row.associatedServices.length,
      cell: ({ row }) => <span>{row.original.associatedServices.length}</span>,
    },
    {
      id: "actions",
      enableSorting: false,
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            aria-label={`Edit ${row.original.name}`}
            disabled={deletingId === row.original.id}
            className="border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            <Link href={`/admin/forms/${row.original.id}/edit`}>
              <Pencil className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            aria-label={`Preview ${row.original.name}`}
            disabled={deletingId === row.original.id}
            className="border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            <Link href={`/admin/forms/${row.original.id}/preview`}>
              <Eye className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            aria-label={`Responses for ${row.original.name}`}
            disabled={deletingId === row.original.id}
            className="border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            <Link href={`/admin/forms/${row.original.id}/responses`}>
              <MessageSquare className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
            aria-label={`Delete ${row.original.name}`}
            disabled={deletingId === row.original.id}
          >
            {deletingId === row.original.id ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      ),
    },
  ],
    [deletingId, updatingId]
  );

  const table = useReactTable({
    data: filteredForms,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });

  const handleDelete = async (id: string) => {
    const form = forms.find((f) => f.id === id);
    if (form) {
      // Open modal immediately
      setFormToDelete(form);
      setServiceFormUpdates({}); // Reset updates
      setFormDetails(null); // Reset form details to show loading
      setDeleteDialogOpen(true);

      // Fetch form details in background
      try {
        const response = await fetch(`/api/admin/forms/${id}`);
        if (response.ok) {
          const formData = await response.json();
          setFormDetails({
            associatedServices: formData.associatedServices || [],
            responsesCount: formData.responsesCount || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching form details:", error);
        setFormDetails({ associatedServices: [], responsesCount: 0 });
      }
    }
  };

  const handleServiceFormUpdate = async (
    serviceId: string,
    newFormId: string
  ) => {
    if (newFormId === "remove") {
      newFormId = ""; // Remove form association
    }

    setServiceFormUpdates((prev) => ({
      ...prev,
      [serviceId]: newFormId,
    }));

    // Only show toast for actual form changes, not for "remove" option
    if (newFormId !== "") {
      // Update the service
      try {
        const response = await fetch(`/api/admin/services/${serviceId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formId: newFormId || null,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            toast.success("Service form association updated successfully");
            router.refresh(); // Refresh to update related data
          } else {
            toast.error(
              `Failed to update service: ${data.message || "Unknown error"}`
            );
          }
        } else {
          const error = await response
            .json()
            .catch(() => ({ message: "Unknown error" }));
          toast.error(
            `Failed to update service: ${error.message || "Unknown error"}`
          );
        }
      } catch (error) {
        toast.error("Network error occurred while updating service");
      }
    }
  };

  // Check if all services have been reassigned
  const allServicesReassigned =
    formDetails?.associatedServices.every(
      (service) =>
        serviceFormUpdates[service.id] &&
        serviceFormUpdates[service.id] !== service.formId
    ) || formDetails?.associatedServices.length === 0;

  const confirmDelete = async () => {
    if (!formToDelete || !allServicesReassigned) return;

    setDeletingId(formToDelete.id);
    setDeleteDialogOpen(false);

    try {
      // Step 1: Delete the form (since all services have been reassigned)
      toast.info("Deleting form and all responses...");

      const response = await fetch(`/api/admin/forms/${formToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setForms((prev) => prev.filter((f) => f.id !== formToDelete.id));
        toast.success(`Form "${formToDelete.name}" deleted successfully!`);
        router.refresh(); // Refresh to update any related data
      } else {
        const error = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        toast.error(`Failed to delete form: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      toast.error(
        "Network error occurred while deleting form. Please try again."
      );
    } finally {
      setDeletingId(null);
      setFormToDelete(null);
      setFormDetails(null);
      setServiceFormUpdates({});
    }
  };

  const handleTypeChange = async (id: string, nextType: FormType) => {
    setUpdatingId(id);

    const res = await fetch(`/api/admin/forms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: nextType }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(
        `Failed to update form type: ${data?.error || "Unknown error"}`
      );
      setUpdatingId(null);
      return;
    }

    setForms((prev) =>
      prev.map((f) => (f.id === id ? { ...f, type: nextType } : f))
    );

    const form = forms.find((f) => f.id === id);
    toast.success(
      `Form "${form?.name}" type updated to ${nextType.replace("_", " ")}`
    );
    router.refresh(); // Refresh to update any related data
    setUpdatingId(null);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-700/80">Loading forms...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Forms Management
            </h1>
            <p className="text-blue-700">
              Manage your forms and their configurations
            </p>
          </div>
          <Link
            href="/admin/forms/builder"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Create new form"
          >
            Create new
          </Link>
        </div>

        {/* Forms Management Card */}
        <Card className="border border-blue-100 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-blue-800">
              Forms ({filteredForms.length})
            </CardTitle>
            <CardDescription className="text-blue-700">
              Search and manage your forms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  Search Forms
                </label>
                <Input
                  placeholder="Search by form name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-blue-200 focus-visible:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  Type Filter
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent className="border-blue-200 [&_[data-slot=select-item]:focus]:bg-blue-600 [&_[data-slot=select-item]:focus]:text-white">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="SERVICE_FORM">Service Form</SelectItem>
                    <SelectItem value="CONTACT_FORM">Contact Form</SelectItem>
                    <SelectItem value="LAWYER_REGISTRATION">
                      Registration
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-blue-100"></div>

            {/* Forms Table */}
            {table.getRowModel().rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-blue-900">
                    No forms found
                  </h3>
                  <p className="text-blue-700">
                    {searchTerm || typeFilter !== "all"
                      ? `No forms match your current filters`
                      : "Create your first form to get started"}
                  </p>
                  <Link href="/admin/forms/builder">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Create Form
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-blue-700">
                    Showing {table.getRowModel().rows.length} of {filteredForms.length}
                  </div>
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
                </div>

                <div className="w-full max-w-full overflow-x-auto">
                <Table className="min-w-[1000px] whitespace-nowrap">
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className={header.column.id === "actions" ? "text-right text-blue-800" : "text-blue-800"}>
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-blue-50/60 transition-colors">
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
              </>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-500" />
                Delete Form
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <div>
                  Are you sure you want to delete{" "}
                  <strong>"{formToDelete?.name}"</strong>
                  {formToDelete?.type && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {formToDelete.type.replace("_", " ")}
                    </Badge>
                  )}
                  ?
                </div>

                <div className="bg-red-50 border border-red-200 rounded-md p-3 space-y-2">
                  <div className="font-medium text-red-800">
                    This action cannot be undone and will:
                  </div>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Remove this form from all associated services</li>
                    <li>• Delete all form responses permanently</li>
                    <li>• Break any existing case associations</li>
                  </ul>

                  {formDetails ? (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="font-medium text-gray-800 mb-3">
                        Associated Services (
                        {formDetails.associatedServices.length}):
                      </div>
                      {formDetails.associatedServices.length > 0 ? (
                        <div className="space-y-4 max-h-60 overflow-y-auto">
                          <div className="text-sm text-gray-700 mb-3 p-2 bg-gray-50 rounded">
                            You must reassign each service to a different form
                            before you can delete this form:
                          </div>
                          {formDetails.associatedServices.map((service) => (
                            <div
                              key={service.id}
                              className={`border rounded p-3 ${
                                serviceFormUpdates[service.id] &&
                                serviceFormUpdates[service.id] !==
                                  service.formId
                                  ? "bg-green-50 border-green-200"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {service.name}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Category: {service.categoryName}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Select
                                  value={
                                    serviceFormUpdates[service.id] ||
                                    service.formId ||
                                    ""
                                  }
                                  onValueChange={(value) =>
                                    handleServiceFormUpdate(service.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-40 h-8 text-xs">
                                    <SelectValue placeholder="Select form" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="remove">
                                      Remove Association
                                    </SelectItem>
                                    {allForms
                                      .filter((f) => f.id !== formToDelete?.id)
                                      .map((form) => (
                                        <SelectItem
                                          key={form.id}
                                          value={form.id}
                                        >
                                          {form.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>

                                {serviceFormUpdates[service.id] &&
                                  serviceFormUpdates[service.id] !==
                                    service.formId && (
                                    <div className="text-xs text-green-600 font-medium">
                                      Updated
                                    </div>
                                  )}
                              </div>
                            </div>
                          ))}

                          {!allServicesReassigned && (
                            <div className="text-sm text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                              Please update all services above before you can
                              delete this form
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                          No services are currently using this form
                        </div>
                      )}

                      <div className="mt-3 text-sm text-gray-600">
                        Form Responses: {formDetails.responsesCount}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-center py-8">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm text-gray-600">
                            Loading form details...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setFormToDelete(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={
                  deletingId === formToDelete?.id || !allServicesReassigned
                }
                className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === formToDelete?.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Deleting...
                  </>
                ) : !allServicesReassigned ? (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Update Services First
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Form
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

type TypeDropdownProps = {
  value: FormType;
  disabled?: boolean;
  onChange: (next: FormType) => void;
};

const TypeDropdown = ({ value, disabled, onChange }: TypeDropdownProps) => {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as FormType)}
      disabled={disabled}
    >
      <SelectTrigger
        className="w-44"
        aria-label="Change form type"
        tabIndex={0}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="SERVICE_FORM">Service</SelectItem>
        <SelectItem value="CONTACT_FORM">Contact</SelectItem>
        <SelectItem value="LAWYER_REGISTRATION">Registration</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default Page;
