import { useRef, useState } from "react";
import ExcelJS from "exceljs";
import { Download, Upload, FileSpreadsheet, Loader2, X, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useGetCarBrands, useGetCategories, useCreateProduct, useUpdateProduct, getGetProductsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

type ImportRow = {
  status: "pending" | "success" | "error";
  name: string;
  action: "create" | "update";
  error?: string;
};

function parseVariations(raw: string): { name: string; options: string[] }[] {
  if (!raw || !raw.trim()) return [];
  return raw
    .split("|")
    .map(part => part.trim())
    .filter(Boolean)
    .map(part => {
      const colonIdx = part.indexOf(":");
      if (colonIdx === -1) return null;
      const name = part.slice(0, colonIdx).trim();
      const options = part
        .slice(colonIdx + 1)
        .split(",")
        .map(o => o.trim())
        .filter(Boolean);
      return name ? { name, options } : null;
    })
    .filter((v): v is { name: string; options: string[] } => v !== null);
}

function triggerDownload(buffer: ArrayBuffer, filename: string) {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ProductBulkActions({
  onImportDone,
}: {
  onImportDone: () => void;
}) {
  const { data: categories } = useGetCategories();
  const { data: carBrands } = useGetCarBrands();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [importRows, setImportRows] = useState<ImportRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [showLog, setShowLog] = useState(false);

  const headers = [
    "ID (leave blank for new products)",
    "Product Name *",
    "Description",
    "Categories (comma-separated names)",
    "Compatible Car Brands (comma-separated names)",
    "Compatible Car Models (comma-separated names)",
    "Variations (e.g. Color:Red,Blue|Size:S,M,L)",
    "Brand / Manufacturer",
    "SKU",
  ];

  const downloadTemplate = async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Products");

    ws.addRow(headers);
    ws.addRow([
      "",
      "Proton Saga Floor Mat",
      "Premium waterproof floor mat designed for exact fit",
      "Car Mats",
      "Proton",
      "Proton Saga (Gen 5), Proton Saga (Gen 4)",
      "Color:Black,Beige|Material:Rubber,Carpet",
      "TWM Accessories",
      "TWM-MAT-001",
    ]);

    const colWidths = [28, 30, 45, 40, 40, 40, 40, 40, 40];
    colWidths.forEach((width, i) => {
      ws.getColumn(i + 1).width = width;
    });

    if (categories && categories.length > 0) {
      const catWs = wb.addWorksheet("Ref - Categories");
      catWs.addRow(["Available Categories"]);
      categories.forEach(c => catWs.addRow([c.name]));
      catWs.getColumn(1).width = 35;
    }

    if (carBrands && carBrands.length > 0) {
      const bmWs = wb.addWorksheet("Ref - Brands & Models");
      bmWs.addRow(["Brand", "Car Models"]);
      for (const brand of carBrands) {
        bmWs.addRow([brand.name, brand.models.map(m => m.name).join(", ")]);
      }
      bmWs.getColumn(1).width = 25;
      bmWs.getColumn(2).width = 80;
    }

    const buffer = await wb.xlsx.writeBuffer();
    triggerDownload(buffer as ArrayBuffer, "TWM_Products_Template.xlsx");
  };

  const downloadProducts = async () => {
    try {
      const res = await fetch("/api/products?limit=9999");
      const json = await res.json();
      const products = json.products ?? [];

      if (products.length === 0) {
        toast({ title: "No products to export" });
        return;
      }

      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("Products");

      ws.addRow(headers);

      for (const p of products as Record<string, unknown>[]) {
        const categoryNames = (p.categoryIds as number[] ?? [])
          .map((id: number) => categories?.find(c => c.id === id)?.name ?? "")
          .filter(Boolean)
          .join(", ");

        const brandNames = (p.carBrandIds as number[] ?? [])
          .map((id: number) => carBrands?.find(b => b.id === id)?.name ?? "")
          .filter(Boolean)
          .join(", ");

        const allModels = carBrands?.flatMap(b => b.models) ?? [];
        const modelNames = (p.carModelIds as number[] ?? [])
          .map((id: number) => allModels.find(m => m.id === id)?.name ?? "")
          .filter(Boolean)
          .join(", ");

        const variations = ((p.variations ?? []) as { name: string; options: string[] }[])
          .map(v => `${v.name}:${v.options.join(",")}`)
          .join("|");

        ws.addRow([
          p.id ?? "",
          p.name ?? "",
          p.description ?? "",
          categoryNames,
          brandNames,
          modelNames,
          variations,
          p.brand ?? "",
          p.sku ?? "",
        ]);
      }

      const colWidths = [10, 30, 45, 40, 40, 40, 40, 40, 40];
      colWidths.forEach((width, i) => {
        ws.getColumn(i + 1).width = width;
      });

      if (categories && categories.length > 0) {
        const catWs = wb.addWorksheet("Ref - Categories");
        catWs.addRow(["Available Categories"]);
        categories.forEach(c => catWs.addRow([c.name]));
        catWs.getColumn(1).width = 35;
      }

      if (carBrands && carBrands.length > 0) {
        const bmWs = wb.addWorksheet("Ref - Brands & Models");
        bmWs.addRow(["Brand", "Car Models"]);
        for (const brand of carBrands) {
          bmWs.addRow([brand.name, brand.models.map(m => m.name).join(", ")]);
        }
        bmWs.getColumn(1).width = 25;
        bmWs.getColumn(2).width = 80;
      }

      const buffer = await wb.xlsx.writeBuffer();
      triggerDownload(buffer as ArrayBuffer, "TWM_Products_Export.xlsx");
      toast({ title: `Exported ${products.length} products` });
    } catch {
      toast({ title: "Export failed", variant: "destructive" });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setImporting(true);
    setShowLog(true);
    setImportRows([]);

    try {
      const buffer = await file.arrayBuffer();
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(buffer);

      const ws = wb.worksheets[0];
      if (!ws) {
        toast({ title: "No sheets found in file", variant: "destructive" });
        setImporting(false);
        return;
      }

      const rawRows: Record<string, string>[] = [];
      let headerRow: string[] = [];

      ws.eachRow((row, rowNumber) => {
        const values = (row.values as (string | number | null | undefined)[]).slice(1);
        if (rowNumber === 1) {
          headerRow = values.map(v => String(v ?? ""));
        } else {
          const obj: Record<string, string> = {};
          headerRow.forEach((h, i) => {
            obj[h] = String(values[i] ?? "");
          });
          rawRows.push(obj);
        }
      });

      const rows = rawRows.filter(row =>
        Object.values(row).some(v => v.trim() !== "")
      );

      if (rows.length === 0) {
        toast({ title: "No data rows found in file", variant: "destructive" });
        setImporting(false);
        return;
      }

      const allModels = carBrands?.flatMap(b => b.models) ?? [];

      const pending: ImportRow[] = rows.map(row => {
        const idRaw = String(row["ID (leave blank for new products)"] ?? row["ID"] ?? "").trim();
        const id = idRaw && !isNaN(Number(idRaw)) ? Number(idRaw) : null;
        return {
          status: "pending",
          action: id ? "update" : "create",
          name: String(row["Product Name *"] ?? row["Product Name"] ?? "").trim() || "(unnamed)",
        };
      });
      setImportRows(pending);

      let createdCount = 0;
      let updatedCount = 0;
      let errorCount = 0;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const name = String(row["Product Name *"] ?? row["Product Name"] ?? "").trim();
        const idRaw = String(row["ID (leave blank for new products)"] ?? row["ID"] ?? "").trim();
        const id = idRaw && !isNaN(Number(idRaw)) ? Number(idRaw) : null;

        if (!name) {
          setImportRows(prev =>
            prev.map((r, idx) => idx === i ? { ...r, status: "error", error: "Product name is required" } : r)
          );
          errorCount++;
          continue;
        }

        const categoryInput = String(row["Categories (comma-separated names)"] ?? row["Categories"] ?? "").trim();
        const categoryIds: number[] = categoryInput
          ? categoryInput.split(",").map(s => s.trim()).filter(Boolean)
              .map(n => categories?.find(c => c.name.toLowerCase() === n.toLowerCase())?.id)
              .filter((id): id is number => id !== undefined)
          : [];

        const brandInput = String(row["Compatible Car Brands (comma-separated names)"] ?? row["Compatible Car Brands"] ?? "").trim();
        const carBrandIds: number[] = brandInput
          ? brandInput.split(",").map(s => s.trim()).filter(Boolean)
              .map(n => carBrands?.find(b => b.name.toLowerCase() === n.toLowerCase())?.id)
              .filter((id): id is number => id !== undefined)
          : [];

        const modelInput = String(row["Compatible Car Models (comma-separated names)"] ?? row["Compatible Car Models"] ?? "").trim();
        const carModelIds: number[] = modelInput
          ? modelInput.split(",").map(s => s.trim()).filter(Boolean)
              .map(n => allModels.find(m => m.name.toLowerCase() === n.toLowerCase())?.id)
              .filter((id): id is number => id !== undefined)
          : [];

        const variationInput = String(row["Variations (e.g. Color:Red,Blue|Size:S,M,L)"] ?? row["Variations"] ?? "").trim();
        const variations = parseVariations(variationInput);

        const brand = String(row["Brand / Manufacturer"] ?? row["Brand"] ?? "").trim() || null;
        const sku = String(row["SKU"] ?? "").trim() || null;
        const description = String(row["Description"] ?? "").trim() || null;

        try {
          if (id) {
            await updateProduct.mutateAsync({
              id,
              data: {
                name,
                description,
                categoryIds,
                categoryId: categoryIds[0] ?? undefined,
                carBrandIds,
                carModelIds,
                variations,
                brand,
                sku,
              } as Parameters<typeof updateProduct.mutateAsync>[0]["data"],
            });
            setImportRows(prev =>
              prev.map((r, idx) => idx === i ? { ...r, status: "success" } : r)
            );
            updatedCount++;
          } else {
            await createProduct.mutateAsync({
              data: {
                name,
                description,
                price: 0,
                stock: 0,
                categoryIds,
                categoryId: categoryIds[0] ?? undefined,
                carBrandIds,
                carModelIds,
                variations,
                brand,
                sku,
              }
            });
            setImportRows(prev =>
              prev.map((r, idx) => idx === i ? { ...r, status: "success" } : r)
            );
            createdCount++;
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Failed";
          setImportRows(prev =>
            prev.map((r, idx) => idx === i ? { ...r, status: "error", error: msg } : r)
          );
          errorCount++;
        }
      }

      queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
      onImportDone();

      const parts = [];
      if (updatedCount > 0) parts.push(`${updatedCount} updated`);
      if (createdCount > 0) parts.push(`${createdCount} created`);
      if (errorCount > 0) parts.push(`${errorCount} failed`);
      toast({
        title: `Import complete: ${parts.join(", ")}`,
        variant: errorCount > 0 ? "destructive" : "default",
      });
    } catch {
      toast({ title: "Failed to read file", variant: "destructive" });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={downloadTemplate}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-border bg-background hover:border-primary hover:text-primary text-sm font-bold uppercase tracking-widest transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Template
        </button>

        <button
          type="button"
          onClick={downloadProducts}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-border bg-background hover:border-primary hover:text-primary text-sm font-bold uppercase tracking-widest transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </button>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={importing}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold uppercase tracking-widest transition-colors disabled:opacity-60"
        >
          {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {importing ? "Importing..." : "Import / Update"}
        </button>

        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      <p className="text-xs text-muted-foreground font-mono">
        Export your products, edit in Excel, then import back — rows with an ID will be updated, rows without an ID will be created as new products.
      </p>

      {showLog && importRows.length > 0 && (
        <div className="border border-border bg-card">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Import Log — {importRows.filter(r => r.status === "success").length}/{importRows.length} done
              {importRows.some(r => r.action === "update") && (
                <span className="ml-2 text-primary">
                  ({importRows.filter(r => r.status === "success" && r.action === "update").length} updated,{" "}
                  {importRows.filter(r => r.status === "success" && r.action === "create").length} created)
                </span>
              )}
            </span>
            <button type="button" onClick={() => setShowLog(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="max-h-52 overflow-y-auto divide-y divide-border">
            {importRows.map((row, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2 text-sm">
                {row.status === "pending" && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground flex-shrink-0" />}
                {row.status === "success" && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                {row.status === "error" && <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />}
                <span className="flex-shrink-0">
                  {row.action === "update"
                    ? <RefreshCw className="w-3 h-3 text-blue-500" />
                    : <span className="text-xs font-mono text-muted-foreground">new</span>
                  }
                </span>
                <span className={`font-mono truncate flex-1 ${row.status === "error" ? "text-destructive" : ""}`}>
                  {row.name}
                </span>
                {row.error && <span className="text-xs text-muted-foreground truncate max-w-48">{row.error}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
