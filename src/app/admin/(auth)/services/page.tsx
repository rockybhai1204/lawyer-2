"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Search, Eye, X, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { ServiceTableData, ApiServiceCategory } from "@/types/api/services";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableExportDropdown } from "@/components/ui/table-export-dropdown";

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceTableData[]>([]);
  const [categories, setCategories] = useState<ApiServiceCategory[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceTableData[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/services/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/admin/services/table");
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
        setFilteredServices(data.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    setIsCreatingCategory(true);
    try {
      const response = await fetch("/api/admin/services/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const data = await response.json();
      if (data.success) {
        setCategories([data.data, ...categories]);
        setNewCategoryName("");
        setIsCreateCategoryOpen(false);
      } else {
        alert(data.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, selectedCategories);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
  };

  const applyFilters = (query: string, categoryIds: string[]) => {
    let filtered = services;

    // Filter by categories
    if (categoryIds.length > 0) {
      const selectedCategoryNames = categories
        .filter((cat) => categoryIds.includes(cat.id))
        .map((cat) => cat.name);

      filtered = filtered.filter((service) =>
        selectedCategoryNames.includes(service.categoryName)
      );
    }

    // Filter by search query
    if (query.trim()) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(query.toLowerCase()) ||
          service.categoryName.toLowerCase().includes(query.toLowerCase()) ||
          service.formName.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  const handleViewService = (service: ServiceTableData) => {
    window.open(
      `/services/${service.categorySlug}/${service.slug}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  useEffect(() => {
    applyFilters(searchQuery, selectedCategories);
    setCurrentPage(1); // Reset to first page when filters change
  }, [services, searchQuery, selectedCategories]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredServices.length / pageSize));

  // TanStack Table setup over filteredServices (sorting/visibility)
  const columns: ColumnDef<ServiceTableData>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Service Name
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      ),
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
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
      id: "categoryName",
      accessorKey: "categoryName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.categoryName}</span>,
    },
    {
      id: "formName",
      accessorKey: "formName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0 gap-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Form
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.formName}</span>,
    },
    {
      id: "actions",
      enableSorting: false,
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(
                `/services/${row.original.categorySlug}/${row.original.slug}`,
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(`/admin/services/builder?edit=${row.original.id}`)
            }
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredServices,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const sortedRows = table.getRowModel().rows;
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Services Management</h1>
          <p className="text-gray-600">
            Manage your legal services and categories
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog
            open={isCreateCategoryOpen}
            onOpenChange={setIsCreateCategoryOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new service category to organize your services.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateCategoryOpen(false);
                      setNewCategoryName("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCategory}
                    disabled={isCreatingCategory || !newCategoryName.trim()}
                  >
                    {isCreatingCategory ? "Creating..." : "Create"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={() => router.push("/admin/services/builder")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Service
          </Button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search & Filter Services
            </CardTitle>
            {(selectedCategories.length > 0 || searchQuery) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="text-sm"
              >
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>
          <CardDescription>
            Search services and filter by categories. You can select multiple
            categories.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by service name, category, or form..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filters */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Filter by Categories:
            </Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category.id);
                const categoryServiceCount = services.filter(
                  (service) => service.categoryName === category.name
                ).length;

                return (
                  <div
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`
                      px-3 py-2 rounded-md border cursor-pointer transition-all duration-200 text-sm
                      ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                  >
                    <span className="font-medium">{category.name}</span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({categoryServiceCount})
                    </span>
                  </div>
                );
              })}
            </div>

            {categories.length === 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No categories available. Create your first category to get
                started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Services ({filteredServices.length})</CardTitle>
          <CardDescription>
            Manage your legal services and their configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-sm text-muted-foreground">
                  Loading services...
                </p>
              </div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">No services found</h3>
                <p className="text-gray-600">
                  {searchQuery || selectedCategories.length > 0
                    ? `No services match your current filters`
                    : "Create your first service to get started"}
                </p>
                <Button onClick={() => router.push("/admin/services/builder")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Service
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-600">
                  Showing {pageRows.length} of {filteredServices.length}
                </div>
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
                    fileBaseName="services"
                    headerLabels={{ name: "Service Name", isActive: "Status", categoryName: "Category", formName: "Form" }}
                    valueFormatter={(row, colId, ctx) => {
                      if (colId === "isActive") return row.isActive ? "Active" : "Inactive";
                      return (row as any)[colId] ?? "";
                    }}
                  />
                </div>
              </div>

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
                  {pageRows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className={cell.column.id === "actions" ? "text-right" : undefined}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {filteredServices.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * pageSize + 1}–
                    {Math.min(currentPage * pageSize, filteredServices.length)}{" "}
                    of {filteredServices.length}
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
                            aria-current={
                              p === currentPage ? "page" : undefined
                            }
                            aria-label={`Page ${p}`}
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
                      >
                        Last
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
