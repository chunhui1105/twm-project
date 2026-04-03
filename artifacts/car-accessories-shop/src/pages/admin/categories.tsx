import { AdminLayout } from "@/components/admin-layout";
import {
  useGetCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useReorderCategories,
  getGetCategoriesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, Upload, X, ImageIcon, Plus, Trash2, Pencil, Check, GripVertical } from "lucide-react";
import { ObjectUploader, useUpload } from "@workspace/object-storage-web";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Category = {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  productCount: number;
  sortOrder: number;
};

function SortableCategoryRow({
  category,
  onDelete,
  onStartNameEdit,
  onStartImageEdit,
  confirmDeleteId,
  setConfirmDeleteId,
  nameEditId,
  editName,
  setEditName,
  onSaveName,
  imageEditId,
  imageUrl,
  setImageUrl,
  onSaveImage,
  setImageEditId,
  getUploadParameters,
  toast,
  deletePending,
  updatePending,
}: {
  category: Category;
  onDelete: (id: number) => void;
  onStartNameEdit: (id: number, name: string) => void;
  onStartImageEdit: (id: number, url: string) => void;
  confirmDeleteId: number | null;
  setConfirmDeleteId: (id: number | null) => void;
  nameEditId: number | null;
  editName: string;
  setEditName: (v: string) => void;
  onSaveName: (id: number) => void;
  imageEditId: number | null;
  imageUrl: string;
  setImageUrl: (v: string) => void;
  onSaveImage: (id: number) => void;
  setImageEditId: (id: number | null) => void;
  getUploadParameters: any;
  toast: any;
  deletePending: boolean;
  updatePending: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="border border-border bg-card">
      <div className="flex items-start gap-4 p-5">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-6 flex-shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-colors touch-none"
          title="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Thumbnail */}
        <div className="w-20 h-20 flex-shrink-0 border border-border bg-secondary overflow-hidden flex items-center justify-center">
          {category.imageUrl ? (
            <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-7 h-7 text-muted-foreground" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name row */}
          <div className="flex items-center gap-2 mb-1">
            {nameEditId === category.id ? (
              <>
                <input
                  autoFocus
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSaveName(category.id);
                    if (e.key === "Escape") onStartNameEdit(-1, "");
                  }}
                  className="bg-background border border-primary px-2 py-1 text-sm font-bold focus:outline-none flex-1 max-w-xs"
                />
                <button onClick={() => onSaveName(category.id)} className="p-1 text-primary hover:text-primary/80">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => onStartNameEdit(-1, "")} className="p-1 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <h3 className="font-bold uppercase tracking-tight truncate">{category.name}</h3>
                <button
                  onClick={() => onStartNameEdit(category.id, category.name)}
                  className="p-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono mb-3">
            <span>slug: {category.slug}</span>
            <span>•</span>
            <span>{category.productCount} products</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => onStartImageEdit(category.id, category.imageUrl || "")}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 border border-primary/30 px-3 py-1.5 hover:border-primary transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              {category.imageUrl ? "Change Image" : "Set Image"}
            </button>

            {confirmDeleteId === category.id ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-destructive font-mono">Delete?</span>
                <button
                  onClick={() => onDelete(category.id)}
                  disabled={deletePending}
                  className="text-xs font-bold uppercase tracking-widest text-destructive border border-destructive/40 px-3 py-1.5 hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50"
                >
                  {deletePending ? "..." : "Yes, delete"}
                </button>
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-3 py-1.5 hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDeleteId(category.id)}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive border border-border px-3 py-1.5 hover:border-destructive/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Image editor (expandable) */}
      {imageEditId === category.id && (
        <div className="border-t border-border p-5 bg-background space-y-3">
          <ObjectUploader
            maxNumberOfFiles={1}
            maxFileSize={10 * 1024 * 1024}
            onGetUploadParameters={getUploadParameters}
            onComplete={(result) => {
              const successful = result.successful;
              if (successful?.length) {
                const uploadURL = successful[0].uploadURL;
                if (uploadURL) {
                  const url = new URL(uploadURL);
                  const uuid = url.pathname.split("/").pop();
                  setImageUrl(`/api/storage/objects/uploads/${uuid}`);
                  toast({ title: "Image ready — click Save to apply" });
                }
              }
            }}
            buttonClassName="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs px-4 py-2.5 hover:bg-primary/90 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> Upload Image
          </ObjectUploader>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-mono">or paste URL</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <input
            type="url"
            placeholder="https://..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary font-mono text-sm"
          />

          {imageUrl && (
            <div className="relative w-28 h-20 border border-border overflow-hidden">
              <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
              <button
                onClick={() => setImageUrl("")}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => onSaveImage(category.id)}
              disabled={updatePending}
              className="bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs px-5 py-2.5 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {updatePending ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => { setImageEditId(null); setImageUrl(""); }}
              className="text-muted-foreground font-bold uppercase tracking-widest text-xs px-5 py-2.5 hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCategories() {
  const { data: categories, isLoading } = useGetCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const reorderMutation = useReorderCategories();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [items, setItems] = useState<Category[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (categories) setItems(categories as Category[]);
  }, [categories]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Add form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Image edit
  const [imageEditId, setImageEditId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  // Name edit
  const [nameEditId, setNameEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  // Delete confirm
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const { getUploadParameters } = useUpload({
    basePath: "/api/storage",
    onError: (err) => toast({ title: "Upload failed", description: err.message, variant: "destructive" }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setItems((prev) => {
      const oldIndex = prev.findIndex((c) => c.id === active.id);
      const newIndex = prev.findIndex((c) => c.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
    setIsDirty(true);
  };

  const handleSaveOrder = () => {
    reorderMutation.mutate(
      { data: { orderedIds: items.map((c) => c.id) } },
      {
        onSuccess: () => {
          toast({ title: "Order saved" });
          setIsDirty(false);
          invalidate();
        },
        onError: () => toast({ title: "Failed to save order", variant: "destructive" }),
      }
    );
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    createMutation.mutate(
      { data: { name: newName.trim(), description: newDescription.trim() || undefined } },
      {
        onSuccess: () => {
          toast({ title: "Category added" });
          setNewName(""); setNewDescription(""); setShowAddForm(false);
          invalidate();
        },
        onError: () => toast({ title: "Failed to add category", variant: "destructive" }),
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Category deleted" });
        setConfirmDeleteId(null);
        invalidate();
      },
      onError: () => toast({ title: "Failed to delete category", variant: "destructive" }),
    });
  };

  const handleSaveName = (id: number) => {
    if (!editName.trim()) return;
    updateMutation.mutate({ id, data: { name: editName.trim() } }, {
      onSuccess: () => { toast({ title: "Name updated" }); setNameEditId(null); invalidate(); },
    });
  };

  const handleSaveImage = (id: number) => {
    updateMutation.mutate({ id, data: { imageUrl: imageUrl || undefined } }, {
      onSuccess: () => { toast({ title: "Image updated" }); setImageEditId(null); setImageUrl(""); invalidate(); },
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-border flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter uppercase">Categories</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Drag <GripVertical className="inline w-3.5 h-3.5" /> to reorder. Click save when done.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isDirty && (
              <button
                onClick={handleSaveOrder}
                disabled={reorderMutation.isPending}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs px-5 py-3 hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {reorderMutation.isPending ? "Saving..." : "Save Order"}
              </button>
            )}
            <button
              onClick={() => { setShowAddForm(true); setNameEditId(null); setImageEditId(null); }}
              className="inline-flex items-center gap-2 bg-card border border-border text-foreground font-bold uppercase tracking-widest text-xs px-5 py-3 hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="mb-6 border border-primary/40 bg-primary/5 p-6 space-y-4">
            <h3 className="font-bold uppercase tracking-wider text-sm">New Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Name *</label>
                <input
                  autoFocus
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  placeholder="e.g. Car Covers"
                  className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Description (optional)</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Short description..."
                  className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                disabled={!newName.trim() || createMutation.isPending}
                className="bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs px-6 py-2.5 hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? "Adding..." : "Add Category"}
              </button>
              <button
                onClick={() => { setShowAddForm(false); setNewName(""); setNewDescription(""); }}
                className="text-muted-foreground font-bold uppercase tracking-widest text-xs px-6 py-2.5 hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Drag-and-drop list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {items.map((category) => (
                  <SortableCategoryRow
                    key={category.id}
                    category={category}
                    onDelete={handleDelete}
                    onStartNameEdit={(id, name) => { setNameEditId(id === -1 ? null : id); setEditName(name); setImageEditId(null); }}
                    onStartImageEdit={(id, url) => { setImageEditId(imageEditId === id ? null : id); setImageUrl(url); setNameEditId(null); }}
                    confirmDeleteId={confirmDeleteId}
                    setConfirmDeleteId={setConfirmDeleteId}
                    nameEditId={nameEditId}
                    editName={editName}
                    setEditName={setEditName}
                    onSaveName={handleSaveName}
                    imageEditId={imageEditId}
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    onSaveImage={handleSaveImage}
                    setImageEditId={setImageEditId}
                    getUploadParameters={getUploadParameters}
                    toast={toast}
                    deletePending={deleteMutation.isPending}
                    updatePending={updateMutation.isPending}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </AdminLayout>
  );
}
