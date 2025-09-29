import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/user-convex-query";
import { useRouter } from "next/navigation";
import PostEditorHeader from "./post-editor-header";
import PostEditorContent from "./post-editor-content";
import PostEditorSettings from "./post-editor-settings";
import { toast } from "sonner";
import ImageUploadModal from "./image-upload-modal";
const postScheme = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  category: z.string().optional(),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed"),
  featuredImage: z.string().optional(),
  scheduledFor: z.string().optional(),
});

const PostEditor = ({ initialData = null, mode = "create" }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageModalType, setImageModalType] = useState("featured");
  const [quillRef, setQuillRef] = useState(null);
  const router = useRouter();

  const { mutate: createPost, isLoading: isCreateLoading } = useConvexMutation(
    api.posts.create
  );
  const { mutate: updatePost, isLoading: isUpdating } = useConvexMutation(
    api.posts.update
  );

  const onSubmit = async (data, action, silent = false) => {
    try {
      const postData = {
        title: data.title,
        content: data.content,
        category: data.category || undefined,
        tags: data.tags,
        featuredImage: data.featuredImage || undefined,
        status: action === "publish" ? "published" : "draft",
        scheduledFor: data.scheduledFor
          ? new Date(data.scheduledFor).getTime()
          : undefined,
      };

      let resultId;

      if (mode === "edit" && initialData?._id) {
        resultId = await updatePost({
          id: initialData._id,
          ...postData,
        });
      } else if (initialData?._id && action === "draft") {
        resultId = await updatePost({
          id: initialData._id,
          ...postData,
        });
      } else {
        resultId = await createPost(postData);
      }

      if (!silent) {
        const message = "publish" ? "Post published!" : "Draft saved!";
        toast.success(message);
        if (action === "publish") router.push("/dashboard/posts");
      }

      return resultId;
    } catch (error) {
      if (!silent)
        toast.error(error.message || "An error occurred. Please try again.");
      throw error;
    }
  };

  const handleSave = (silent = false) => {
    handleSubmit((data) => onSubmit(data, "draft", silent))();
  };
  const handlePublish = () => {
    handleSubmit((data) => onSubmit(data, "publish"))();
  };
  const handleSchedule = () => {
    if (!watchedValues.scheduledFor) {
      toast.error("Please select a date and time for scheduling.");
      return;
    }
    handleSubmit((data) => onSubmit(data, "schedule"))();
  };
  const form = useForm({
    resolver: zodResolver(postScheme),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      category: initialData?.category || "",
      tags: initialData?.tags || [],
      featuredImage: initialData?.featuredImage || "",
      scheduledFor: initialData?.scheduledFor
        ? new Date(initialData.scheduledFor).toISOString().slice(0, 16)
        : "",
    },
  });
  const { handleSubmit, watch, setValue } = form;
  const watchedValues = watch();
  useEffect(() => {
    if (!watchedValues.title && !watchedValues.content) return;

    const autoSave = setInterval(() => {
      if (watchedValues.title && watchedValues.content) {
        if (mode === "create") handleSave(true);
      }
    }, 30000);

    return () => clearInterval(autoSave);
  }, [watchedValues.title, watchedValues.content]);

  const handleImageSelect = (imageData) => {};

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Headers */}
      <PostEditorHeader
        mode={mode}
        initialData={initialData}
        isPublishing={isCreateLoading || isUpdating}
        onSave={handleSave}
        onPublish={handlePublish}
        onSchedule={handleSchedule}
        onSettingsOpen={() => setIsSettingsOpen(true)}
        onBack={() => router.push("/dashboard")}
      />
      {/* Editor */}
      <PostEditorContent
        form={form}
        setQuillRef={setQuillRef}
        onImageUpload={(type) => {
          setImageModalType(type);
          setIsImageModalOpen(true);
        }}
      />
      {/* Settings Dialog */}
      <PostEditorSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        form={form}
        mode={mode}
      />
      {/* Image Upload Dialog */}

      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onImageSelected={handleImageSelect}
        title={
          imageModalType === "featured"
            ? "Upload Featured Image"
            : "Upload Image"
        }
      />
    </div>
  );
};

export default PostEditor;
