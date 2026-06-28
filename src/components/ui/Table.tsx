import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from './Button';

interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor?: (row: T) => string;
  pageSize?: number;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedRows?: Set<string>;
  onSelectionChange?: (rows: Set<string>) => void;
}

type SortDirection = 'asc' | 'desc' | null;

export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor = (row) => String(row.id || Math.random()),
  pageSize = 10,
  emptyMessage = 'Aucune donnée disponible',
  onRowClick,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [data, sortKey, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      onSelectionChange?.(new Set());
    } else {
      onSelectionChange?.(new Set(paginatedData.map(keyExtractor)));
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    onSelectionChange?.(newSelection);
  };

  const getSortIcon = (key: string) => {
    if (sortKey !== key) return <ArrowUpDown className="w-4 h-4 text-secondary-300" />;
    if (sortDirection === 'asc') return <ArrowUp className="w-4 h-4 text-primary-600" />;
    return <ArrowDown className="w-4 h-4 text-primary-600" />;
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-secondary-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {selectable && (
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`
                    px-4 py-3 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider
                    ${col.sortable ? 'cursor-pointer hover:text-secondary-700 select-none' : ''}
                  `}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && getSortIcon(col.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.map((row) => {
              const rowKey = keyExtractor(row);
              const isSelected = selectedRows.has(rowKey);

              return (
                <tr
                  key={rowKey}
                  className={`
                    transition-colors
                    ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : 'hover:bg-gray-50/50'}
                    ${isSelected ? 'bg-primary-50/50' : ''}
                  `}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(rowKey)}
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5 text-sm text-secondary-700">
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-secondary-500">
            Affichage {startIndex + 1}-{Math.min(startIndex + pageSize, sortedData.length)} sur {sortedData.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 py-1 text-sm text-secondary-700">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
