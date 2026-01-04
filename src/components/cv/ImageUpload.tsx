"use client";

import React, { useState, useRef } from "react";
import { useTranslation } from "@/store/languageStore";
import { FiUpload, FiX, FiImage } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  className,
}) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert(t("editor.personal.photo.invalid") || "Le fichier doit être une image");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const removeImage = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl transition-all duration-200 group cursor-pointer overflow-hidden aspect-square flex flex-col items-center justify-center text-center p-4",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-slate-200 hover:border-primary/50 hover:bg-slate-50",
          value ? "border-solid" : ""
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={onFileChange}
          aria-label={t("editor.personal.photo") || "Photo URL"}
        />

        {value ? (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={value}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-white text-sm font-medium">
                {t("editor.personal.photo.dropzone") || "Changer la photo"}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <FiUpload className="w-6 h-6 text-slate-400 group-hover:text-primary" />
            </div>
            <p className="text-sm text-slate-600 font-medium px-4">
              {t("editor.personal.photo.dropzone") ||
                "Glissez-déposez une photo ou cliquez pour parcourir"}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              PNG, JPG, WEBP (Max. 2MB)
            </p>
          </>
        )}
      </div>

      {value && (
        <Button
          variant="outline"
          size="sm"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/20"
          onClick={(e) => {
            e.stopPropagation();
            removeImage();
          }}
        >
          <FiX className="w-4 h-4 mr-2" />
          {t("editor.personal.photo.remove") || "Supprimer la photo"}
        </Button>
      )}
    </div>
  );
};
