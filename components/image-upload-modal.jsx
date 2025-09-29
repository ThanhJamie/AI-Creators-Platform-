import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { Check, Loader2, Upload, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { buildTransformationUrl, uploadToImageKit } from "@/lib/imagekit";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const transformationSchema = z.object({
  aspectRatio: z.string().default("original"),
  customWidth: z.number().min(100).max(2000).default(800),
  customHeight: z.number().min(100).max(2000).default(600),
  smartCropFocus: z.string().default("auto"),
  textOverlay: z.string().optional(),
  textFontSize: z.number().min(12).max(200).default(50),
  textColor: z.string().default("#ffffff"),
  textPosition: z.string().default("center"),
  backgroundRemoved: z.boolean().default(false),
  dropShadow: z.boolean().default(false),
});

const ASPECT_RATIOS = [
  { label: "Original", value: "original" },
  { label: "Square (1:1)", value: "1:1", width: 400, height: 400 },
  { label: "Landscape (16:9)", value: "16:9", width: 800, height: 450 },
  { label: "Portrait (4:5)", value: "4:5", width: 400, height: 500 },
  { label: "Story (9:16)", value: "9:16", width: 450, height: 800 },
  { label: "Custom", value: "custom" },
];

const SMART_CROP_OPTIONS = [
  { label: "Auto", value: "auto" },
  { label: "Face", value: "face" },
  { label: "Center", value: "center" },
  { label: "Top", value: "top" },
  { label: "Bottom", value: "bottom" },
];

const TEXT_POSITIONS = [
  { label: "Center", value: "center" },
  { label: "Top Left", value: "north_west" },
  { label: "Top Right", value: "north_east" },
  { label: "Bottom Left", value: "south_west" },
  { label: "Bottom Right", value: "south_east" },
  { label: "top", value: "north" },
  { label: "bottom", value: "south" },
  { label: "left", value: "west" },
  { label: "right", value: "east" },
];

const ImageUploadModal = ({
  isOpen,
  onClose,
  onImageSelected,
  title = "Upload & Transform Image",
}) => {
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadImage, setUploadImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [transformedImage, setTransformedImage] = useState(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const { watch, setValue, reset } = useForm({
    resolver: zodResolver(transformationSchema),
    defaultValues: {
      aspectRatio: "original",
      customWidth: 800,
      customHeight: 600,
      smartCropFocus: "auto",
      textOverlay: "",
      textFontSize: 50,
      textColor: "#ffffff",
      textPosition: "center",
      backgroundRemoved: false,
      dropShadow: false,
    },
  });

  const watchedValues = watch();

  const handleClose = () => {
    onClose();
  };

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    console.log("file", file);

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    setIsUploading(true);

    try {
      const fileName = `post-image-${Date.now()}-${file.name}`;
      const result = await uploadToImageKit(file, fileName);

      if (result.success) {
        setUploadImage(result.data);
        setTransformedImage(result.data.url);
        setActiveTab("transform");
        toast.success(
          "Image uploaded successfully. You can now apply transformations."
        );
      } else {
        toast.error(result.error || "Failed to upload image.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred during upload. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".tiff", ".webp"],
    },
    multiple: false,
  });
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-6xl !h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          <DialogDescription>
            Upload an image and apply AI-powered transformations
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={"grid w-full grid-cols-2"}>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="transform" disabled={!uploadImage}>
              Transform
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className={"space-y-4"}>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors`}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <div className="space-y-4">
                  <Loader2 className="h-12 w-12 mx-auto animate-spin text-purple-400" />
                  <p className="text-slate-300">Uploading image ....</p>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 mx-auto text-slate-400" />
                  <div>
                    <p className="text-lg text-white">
                      {isDragActive
                        ? "Drop the image here ..."
                        : "Drag & drop an image here"}
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
                      or click to select a file (JPG, PNG, GIF - Max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
            {uploadImage && (
              <div className="text-center space-y-4">
                <Badge
                  variant="secondary"
                  className="bg-green-500/20 text-green-300 border-green-500/30"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Image uploaded successfully!
                </Badge>
                <div className="text-sm text-slate-400">
                  {uploadImage.width} × {uploadImage.height} •{" "}
                  {Math.round(uploadImage.size / 1024)}KB
                </div>
                <Button
                  onClick={() => setActiveTab("transform")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Start Transforming
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="transform" className={"space-y-6"}>
            Transform section - Coming soon
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadModal;
