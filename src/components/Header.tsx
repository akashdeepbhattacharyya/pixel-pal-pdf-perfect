
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="w-full bg-white py-4 px-6 shadow-sm mb-6">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>
          <h1 className="text-xl font-bold">FileStudio</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-sm">
            Help
          </Button>
          <Button variant="ghost" className="text-sm">
            Pricing
          </Button>
          <Button variant="outline" className="text-sm">
            Sign In
          </Button>
          <Button className="text-sm">
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
