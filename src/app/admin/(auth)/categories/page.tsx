"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2, Edit, Eye, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
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
import type { ApiServiceCategory } from "@/types/api/services";
import { TableExportDropdown } from "@/components/ui/table-export-dropdown";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ApiServiceCategory[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ApiServiceCategory | null>(null);
  const [editName, setEditName] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [categories, search]);

  const columns = useMemo<ColumnDef<ApiServiceCategory>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        enableSorting: true,
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
          <div className="font-medium">{row.original.name}</div>
        ),
      },
      {
        id: "slug",
        accessorKey: "slug",
        enableSorting: true,
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="px-0 gap-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Slug
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-3.5 w-3.5" />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
        ),
        cell: ({ row }) => <Badge variant="secondary">{row.original.slug}</Badge>,
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        enableSorting: true,
        sortingFn: (a, b) =>
          new Date(a.original.createdAt).getTime() - new Date(b.original.createdAt).getTime(),
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
        cell: ({ row }) => (
          <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/services/${row.original.slug}`)}
              title="View public category"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => beginEdit(row.original)}
              title="Rename category"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteCategory(row.original.id)}
              disabled={deletingId === row.original.id}
              className="text-red-600 hover:text-red-700"
              title="Delete category"
            >
              {deletingId === row.original.id ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        ),
      },
    ],
    [router, deletingId]
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const exportVisibleColumns = () =>
    table
      .getAllLeafColumns()
      .filter((c) => c.getIsVisible() && c.id !== "actions");

  const headerLabels = {
    name: "Name",
    slug: "Slug",
    createdAt: "Created",
  } as const;

  const valueFormatter = (row: ApiServiceCategory, colId: string, context: "csv" | "pdf") => {
    if (colId === "createdAt") {
      if (context === "csv") return `'${new Date(row.createdAt).toISOString().slice(0, 10)}`;
      return new Date(row.createdAt).toLocaleDateString();
    }
    return (row as any)[colId] ?? "";
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/services/categories");
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async () => {
    if (!newCategoryName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/services/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => [data.data, ...prev]);
        setNewCategoryName("");
        setIsCreateOpen(false);
      } else {
        alert(data.message || "Failed to create category");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/services/categories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(data.message || "Failed to delete category");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  const beginEdit = (cat: ApiServiceCategory) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editingCategory || !editName.trim()) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/services/categories/${editingCategory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? data.data : c))
        );
        setEditOpen(false);
        setEditingCategory(null);
        setEditName("");
      } else {
        alert(data.message || "Failed to update category");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to update category");
    } finally {
      setSavingEdit(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-600">Manage service categories</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <Button variant="outline" onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Create Category
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new service category to organize services.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="catName">Category Name</Label>
                  <Input
                    id="catName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Corporate Law"
                    className="mt-1"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setNewCategoryName("");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={createCategory} disabled={creating || !newCategoryName.trim()}>
                  {creating ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" /> Categories ({filtered.length})
            </CardTitle>
            <CardDescription>Search and manage categories</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-sm text-muted-foreground">Loading categories...</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">No categories found</h3>
                <p className="text-gray-600">Create your first category to get started</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {table.getRowModel().rows.length} of {filtered.length}
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">Columns</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {table.getAllLeafColumns().filter((c) => c.id !== "actions").map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <TableExportDropdown
                    table={table}
                    fileBaseName="categories"
                    headerLabels={headerLabels}
                    valueFormatter={valueFormatter}
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className={header.column.id === "actions" ? "text-right" : undefined}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
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

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Category</DialogTitle>
            <DialogDescription>
              Updating the name also updates its slug and attached services.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editName">Category Name</Label>
              <Input
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter new category name"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditOpen(false);
                setEditingCategory(null);
                setEditName("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={savingEdit || !editName.trim()}>
              {savingEdit ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


