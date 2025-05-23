
import { useState, useRef, useEffect } from "react";
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

interface ImageEditorProps {
  file: File;
  onBack: () => void;
}

const ImageEditor = ({ file, onBack }: ImageEditorProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(100);
  const [quality, setQuality] = useState(90);
  const [outputFormat, setOutputFormat] = useState(file.type.split('/')[1] || 'jpeg');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  // Load the image when the file changes
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setWidth(img.width);
      setHeight(img.height);
      drawImage();
    };
    img.src = url;
    
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);
  
  // Apply edits when parameters change
  useEffect(() => {
    if (imageRef.current) {
      drawImage();
    }
  }, [brightness, rotation, scale, width, height]);
  
  const drawImage = () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context state
    ctx.save();
    
    // Move to center, rotate, scale, then move back
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    const scaleFactor = scale / 100;
    ctx.scale(scaleFactor, scaleFactor);
    ctx.translate(-imageRef.current.width / 2, -imageRef.current.height / 2);
    
    // Set brightness
    ctx.filter = `brightness(${brightness}%)`;
    
    // Draw image
    ctx.drawImage(imageRef.current, 0, 0);
    
    // Restore context state
    ctx.restore();
  };
  
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value);
    if (isNaN(newWidth) || newWidth <= 0) return;
    
    if (imageRef.current) {
      const aspectRatio = imageRef.current.width / imageRef.current.height;
      setWidth(newWidth);
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };
  
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value);
    if (isNaN(newHeight) || newHeight <= 0) return;
    
    if (imageRef.current) {
      const aspectRatio = imageRef.current.width / imageRef.current.height;
      setHeight(newHeight);
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };
  
  const handleRotate = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360);
  };
  
  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    // Convert canvas to Blob
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error("Failed to generate file");
          return;
        }
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const fileName = file.name.split('.')[0] || 'edited-image';
        
        link.href = url;
        link.download = `${fileName}-edited.${outputFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success("Image downloaded successfully!");
      },
      `image/${outputFormat}`,
      quality / 100
    );
  };
  
  const handleResetImage = () => {
    if (imageRef.current) {
      setWidth(imageRef.current.width);
      setHeight(imageRef.current.height);
      setBrightness(100);
      setRotation(0);
      setScale(100);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Edit Image: {file.name}</span>
            <Button variant="ghost" onClick={onBack} size="sm">
              Back
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex justify-center">
              <div className="overflow-auto max-h-[60vh] border rounded-md p-4">
                <canvas
                  ref={canvasRef}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    display: 'block',
                    margin: '0 auto',
                  }}
                />
              </div>
            </div>
            
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Dimensions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      min="1"
                      value={width}
                      onChange={handleWidthChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (px)</Label>
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
                    <Label>Brightness</Label>
                    <span className="text-sm text-muted-foreground">{brightness}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={200}
                    step={1}
                    value={[brightness]}
                    onValueChange={(value) => setBrightness(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Scale</Label>
                    <span className="text-sm text-muted-foreground">{scale}%</span>
                  </div>
                  <Slider
                    min={10}
                    max={200}
                    step={1}
                    value={[scale]}
                    onValueChange={(value) => setScale(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Rotation</Label>
                  <div className="flex gap-2">
                    <Button onClick={() => handleRotate(-90)} size="sm" variant="outline">
                      Rotate Left
                    </Button>
                    <Button onClick={() => handleRotate(90)} size="sm" variant="outline">
                      Rotate Right
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Quality</Label>
                    <span className="text-sm text-muted-foreground">{quality}%</span>
                  </div>
                  <Slider
                    min={10}
                    max={100}
                    step={1}
                    value={[quality]}
                    onValueChange={(value) => setQuality(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="format">Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleResetImage}>
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

export default ImageEditor;
