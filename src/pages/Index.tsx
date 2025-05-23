
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";
import FileCard from "@/components/FileCard";
import ImageEditor from "@/components/ImageEditor";
import PdfEditor from "@/components/PdfEditor";
import { Image } from "lucide-react";

enum AppState {
  LANDING,
  FILE_SELECTION,
  IMAGE_EDITING,
  PDF_EDITING
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    
    if (file.type.startsWith("image/")) {
      setAppState(AppState.IMAGE_EDITING);
    } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      setAppState(AppState.PDF_EDITING);
    } else {
      // Handle unsupported file type
      setAppState(AppState.LANDING);
    }
  };
  
  const handleGoBack = () => {
    setAppState(AppState.LANDING);
    setSelectedFile(null);
  };
  
  const renderContent = () => {
    switch (appState) {
      case AppState.LANDING:
        return (
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Hero Section */}
              <section className="text-center py-12 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Transform Your Images and PDFs with Ease
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Resize, compress, and enhance your files without losing quality
                </p>
                
                <div className="mt-8 flex justify-center">
                  <div className="w-full max-w-md">
                    <FileUpload 
                      onFileSelect={(file) => {
                        setSelectedFile(file);
                        setAppState(AppState.FILE_SELECTION);
                      }}
                      acceptedTypes={['image/*', 'application/pdf']}
                    />
                  </div>
                </div>
              </section>
              
              {/* Features Section */}
              <section className="py-12">
                <h2 className="text-3xl font-bold text-center mb-12">Powerful Editing Tools</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <div key={index} className="text-center p-6 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </section>
              
              {/* How It Works Section */}
              <section className="py-12 bg-gradient-radial from-blue-50 to-transparent rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {steps.map((step, index) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">
                        <span className="text-lg font-bold">{index + 1}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        );
      
      case AppState.FILE_SELECTION:
        return (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-8 text-center">Choose Your Editor</h2>
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileCard
                  title="Image Editor"
                  description="Resize, crop, rotate, and adjust your images"
                  icon={<Image size={28} />}
                  onClick={() => {
                    if (selectedFile && selectedFile.type.startsWith('image/')) {
                      setAppState(AppState.IMAGE_EDITING);
                    } else {
                      // If the selected file is not an image, prompt user to upload an image
                      setAppState(AppState.LANDING);
                    }
                  }}
                />
                <FileCard
                  title="PDF Editor"
                  description="Resize, compress, and convert PDF documents"
                  icon={
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2V6M12 6H19.5L19.5 22H4.5V6H12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.5 12H14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M9.5 16H14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  }
                  onClick={() => {
                    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf'))) {
                      setAppState(AppState.PDF_EDITING);
                    } else {
                      // If the selected file is not a PDF, prompt user to upload a PDF
                      setAppState(AppState.LANDING);
                    }
                  }}
                />
              </div>
              
              <div className="mt-8 text-center">
                <button
                  onClick={handleGoBack}
                  className="text-primary hover:underline"
                >
                  Upload a different file
                </button>
              </div>
            </div>
          </div>
        );
      
      case AppState.IMAGE_EDITING:
        return (
          <div className="container mx-auto px-4 py-8">
            {selectedFile && (
              <ImageEditor file={selectedFile} onBack={handleGoBack} />
            )}
          </div>
        );
      
      case AppState.PDF_EDITING:
        return (
          <div className="container mx-auto px-4 py-8">
            {selectedFile && (
              <PdfEditor file={selectedFile} onBack={handleGoBack} />
            )}
          </div>
        );
    }
  };

  const features = [
    {
      title: "Resize & Transform",
      description: "Easily resize and transform images and PDFs by dimensions or percentage scale",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 21H3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 3L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 21L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Optimize & Compress",
      description: "Reduce file size without losing quality for faster sharing and downloading",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 17V7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Format Conversion",
      description: "Convert between formats like JPG, PNG, WebP, and PDF effortlessly",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 18L16 12L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  const steps = [
    {
      title: "Upload Your File",
      description: "Drag & drop or browse to upload your image or PDF file"
    },
    {
      title: "Edit & Customize",
      description: "Use our intuitive tools to modify your file as needed"
    },
    {
      title: "Download & Share",
      description: "Download your edited file in your preferred format"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{renderContent()}</main>
      <Footer />
    </div>
  );
};

export default Index;
