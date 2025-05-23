
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes: string[];
  maxSizeMB?: number;
}

const FileUpload = ({ 
  onFileSelect, 
  acceptedTypes,
  maxSizeMB = 10
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    const fileType = file.type;
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    const isTypeValid = acceptedTypes.some(type => {
      if (type === 'image/*') return fileType.startsWith('image/');
      if (type === 'application/pdf') return fileType === 'application/pdf' || fileExtension === 'pdf';
      return type === fileType;
    });

    if (!isTypeValid) {
      toast.error("Invalid file type. Please upload a supported file format.");
      return false;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast.error(`File size exceeds the limit of ${maxSizeMB}MB.`);
      return false;
    }

    return true;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
        toast.success("File uploaded successfully!");
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
        toast.success("File uploaded successfully!");
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const acceptedTypesForInput = acceptedTypes.join(',');

  return (
    <div
      className={`dropzone ${isDragging ? 'active' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={acceptedTypesForInput}
        onChange={handleFileChange}
      />
      <Upload size={40} className="text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold mb-2">Drag & Drop</h3>
      <p className="text-muted-foreground mb-4">
        {acceptedTypes.includes('application/pdf') && acceptedTypes.includes('image/*')
          ? 'Drop your image or PDF file here'
          : acceptedTypes.includes('application/pdf')
          ? 'Drop your PDF file here'
          : 'Drop your image file here'}
      </p>
      <p className="text-xs text-muted-foreground mb-4">Maximum file size: {maxSizeMB}MB</p>
      <Button type="button">
        Browse Files
      </Button>
    </div>
  );
};

export default FileUpload;
