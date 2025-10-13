"use client"

import * as React from "react"
import type { Table as TanStackTable, Column } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ExportContext = "csv" | "pdf"

type Props<TData> = {
  table: TanStackTable<TData>
  fileBaseName?: string
  buttonLabel?: string
  headerLabels?: Record<string, string>
  valueFormatter?: (row: TData, colId: string, context: ExportContext) => string
}

function defaultHeader(col: Column<any, unknown>): string {
  return col.id
}

export function TableExportDropdown<TData>({
  table,
  fileBaseName = "export",
  buttonLabel = "Export",
  headerLabels,
  valueFormatter,
}: Props<TData>) {
  const exportVisibleColumns = React.useCallback(
    () =>
      table
        .getAllLeafColumns()
        .filter((c) => c.getIsVisible() && c.id !== "actions"),
    [table]
  )

  const getHeaderLabel = React.useCallback(
    (colId: string, col: Column<any, unknown>) =>
      headerLabels?.[colId] ?? defaultHeader(col),
    [headerLabels]
  )

  const getCellValue = React.useCallback(
    (row: any, colId: string, context: ExportContext): string => {
      if (valueFormatter) return valueFormatter(row, colId, context)
      const v = row?.[colId]
      return v == null ? "" : String(v)
    },
    [valueFormatter]
  )

  const handleExportCSV = React.useCallback(() => {
    const cols = exportVisibleColumns()
    const headers = cols.map((c) => getHeaderLabel(c.id, c))
    const rows = table.getRowModel().rows.map((r) =>
      cols
        .map((c) => {
          const val = getCellValue(r.original, c.id, "csv")
          const s = String(val).replaceAll('"', '""')
          return `"${s}` + `"`
        })
        .join(",")
    )
    const csv = [headers.join(","), ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${fileBaseName}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [exportVisibleColumns, getCellValue, getHeaderLabel, table, fileBaseName])

  const handleExportPDF = React.useCallback(() => {
    const cols = exportVisibleColumns()
    const headers = cols.map((c) => getHeaderLabel(c.id, c))
    const rows = table.getRowModel().rows.map((r) =>
      cols.map((c) => getCellValue(r.original, c.id, "pdf"))
    )

    const w = window.open("", "_blank")
    if (!w) return
    const styles = `<style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; padding: 24px; }
      h1 { font-size: 18px; margin: 0 0 12px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
      th { background: #f9fafb; }
    </style>`
    const tableHtml = `
      <h1>${fileBaseName}</h1>
      <table>
        <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows
            .map((row) => `<tr>${row.map((c) => `<td>${String(c)}</td>`).join("")}</tr>`)
            .join("")}
        </tbody>
      </table>
    `
    w.document.write(`<html><head><title>${fileBaseName}</title>${styles}</head><body>${tableHtml}</body></html>`) // eslint-disable-line @typescript-eslint/restrict-template-expressions
    w.document.close()
    w.focus()
    w.print()
  }, [exportVisibleColumns, getCellValue, getHeaderLabel, table, fileBaseName])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">{buttonLabel}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV}>Export as CSV</DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>Export as PDF</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


