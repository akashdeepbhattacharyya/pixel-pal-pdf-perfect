
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { toast } from "sonner";

// Note: In a real implementation, we would use a PDF library like PDF.js
// This is a simplified version for the prototype

interface PdfEditorProps {
  file: File;
  onBack: () => void;
}

const PdfEditor = ({ file, onBack }: PdfEditorProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [scaleFactor, setScaleFactor] = useState(100);
  const [compressionLevel, setCompressionLevel] = useState(80);
  const [width, setWidth] = useState(595); // Default A4 width in points
  const [height, setHeight] = useState(842); // Default A4 height in points
  const [outputFormat, setOutputFormat] = useState("pdf");
  
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [file]);
  
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value);
    if (!isNaN(newWidth) && newWidth > 0) {
      setWidth(newWidth);
    }
  };
  
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value);
    if (!isNaN(newHeight) && newHeight > 0) {
      setHeight(newHeight);
    }
  };
  
  const handleReset = () => {
    setScaleFactor(100);
    setCompressionLevel(80);
    setWidth(595);
    setHeight(842);
    setOutputFormat("pdf");
  };
  
  const handleDownload = () => {
    // In a real implementation, we would process the PDF here
    // For the prototype, we'll just simulate a download
    toast.success("PDF processing started...");
    
    setTimeout(() => {
      if (pdfUrl) {
        const link = document.createElement("a");
        link.href = pdfUrl;
        const fileName = file.name.split(".")[0] || "document";
        link.download = `${fileName}-edited.${outputFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("PDF downloaded successfully!");
      }
    }, 1500);
  };
  
  return (
    <div className="animate-fade-in">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Edit PDF: {file.name}</span>
            <Button variant="ghost" onClick={onBack} size="sm">
              Back
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex justify-center">
              <div className="overflow-auto max-h-[60vh] border rounded-md p-4 w-full flex justify-center">
                {pdfUrl && (
                  <iframe
                    src={pdfUrl}
                    className="w-full h-[60vh]"
                    title="PDF Preview"
                  />
                )}
              </div>
            </div>
            
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Page Dimensions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (pts)</Label>
                    <Input
                      id="width"
                      type="number"
                      min="1"
                      value={width}
                      onChange={handleWidthChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (pts)</Label>
                    <Input
                      id="height"
                      type="number"
                      min="1"
                      value={height}
                      onChange={handleHeightChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Scale Factor</Label>
                    <span className="text-sm text-muted-foreground">{scaleFactor}%</span>
                  </div>
                  <Slider
                    min={10}
                    max={200}
                    step={1}
                    value={[scaleFactor]}
                    onValueChange={(value) => setScaleFactor(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Compression</Label>
                    <span className="text-sm text-muted-foreground">{compressionLevel}%</span>
                  </div>
                  <Slider
                    min={10}
                    max={100}
                    step={1}
                    value={[compressionLevel]}
                    onValueChange={(value) => setCompressionLevel(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pdf-format">Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger id="pdf-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="jpeg">JPEG (first page only)</SelectItem>
                      <SelectItem value="png">PNG (first page only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Note: PDF editing requires advanced processing which would normally be handled by server-side libraries. This is a simplified demo showing the user interface.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleDownload}>
            Download
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PdfEditor;
