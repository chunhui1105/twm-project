import { AdminLayout } from "@/components/admin-layout";
import { useGetCategories, useUpdateCategory, getGetCategoriesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import { ObjectUploader, useUpload } from "@workspace/object-storage-web";

export default function AdminCategories() {
  const { data: categories, isLoading } = useGetCategories();
  const updateMutation = useUpdateCategory();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const { getUploadParameters } = useUpload({
    basePath: "/api/storage",
    onError: (err) => toast({ title: "Upload failed", description: err.message, variant: "destructive" }),
  });

  const startEdit = (id: number, currentUrl: string) => {
    setEditingId(id);
    setImageUrl(currentUrl || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setImageUrl("");
  };

  const saveImage = (id: number) => {
    updateMutation.mutate(
      { id, data: { imageUrl: imageUrl || undefined } },
      {
        onSuccess: () => {
          toast({ title: "Category image updated" });
          queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });
          cancelEdit();
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-8 pb-4 border-b border-border">
          <h1 className="text-3xl font-bold tracking-tighter uppercase">Categories</h1>
          <p className="text-muted-foreground mt-1 text-sm">Update the display image for each category shown on the home page.</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {categories?.map((category) => (
              <div key={category.id} className="border border-border bg-card p-6">
                <div className="flex items-start gap-6">
                  {/* Preview */}
                  <div className="w-24 h-24 flex-shrink-0 border border-border bg-secondary overflow-hidden flex items-center justify-center">
                    {category.imageUrl ? (
                      <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>

                  {/* Info + edit */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-lg uppercase tracking-tight">{category.name}</h3>
                      <span className="text-xs font-mono text-muted-foreground">{category.productCount} products</span>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground mb-4">slug: {category.slug}</p>

                    {editingId === category.id ? (
                      <div className="space-y-3">
                        {/* Upload button */}
                        <ObjectUploader
                          maxNumberOfFiles={1}
                          maxFileSize={10 * 1024 * 1024}
                          onGetUploadParameters={getUploadParameters}
                          onComplete={(result) => {
                            const successful = result.successful;
                            if (successful && successful.length > 0) {
                              const uploadURL = successful[0].uploadURL;
                              if (uploadURL) {
                                const url = new URL(uploadURL);
                                setImageUrl(`/api/storage${url.pathname}`);
                                toast({ title: "Image uploaded — click Save to apply" });
                              }
                            }
                          }}
                          buttonClassName="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs px-4 py-2.5 hover:bg-primary/90 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Upload Image
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
                          <div className="relative w-32 h-20 border border-border bg-secondary overflow-hidden">
                            <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setImageUrl("")}
                              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        <div className="flex gap-3 pt-1">
                          <button
                            onClick={() => saveImage(category.id)}
                            disabled={updateMutation.isPending}
                            className="bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs px-5 py-2.5 hover:bg-primary/90 transition-colors disabled:opacity-50"
                          >
                            {updateMutation.isPending ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-muted-foreground font-bold uppercase tracking-widest text-xs px-5 py-2.5 hover:text-foreground transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(category.id, category.imageUrl || "")}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors border border-primary/30 px-4 py-2 hover:border-primary"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        {category.imageUrl ? "Change Image" : "Set Image"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
