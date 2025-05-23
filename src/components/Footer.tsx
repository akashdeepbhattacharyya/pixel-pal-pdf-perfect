
import { Separator } from "./ui/separator";

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-12">
      <div className="container mx-auto">
        <Separator className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">FileStudio</h3>
            <p className="text-sm text-muted-foreground">
              Easily edit, resize, and convert your images and PDF files online without compromising quality.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "Features", "Pricing", "Contact", "FAQ"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FileStudio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
