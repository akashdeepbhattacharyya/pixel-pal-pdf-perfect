
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ZoomIn } from 'lucide-react';

interface FileCardProps {
  title: string;
  description: string;
  icon: JSX.Element;
  onClick: () => void;
}

const FileCard = ({ title, description, icon, onClick }: FileCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={`hover-card p-6 cursor-pointer ${isHovered ? 'shadow-lg' : 'shadow'}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${isHovered ? 'bg-primary text-white' : 'bg-blue-100 text-primary'}`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <Button variant={isHovered ? "default" : "outline"} size="sm">
          Select
        </Button>
      </div>
    </Card>
  );
};

export default FileCard;
