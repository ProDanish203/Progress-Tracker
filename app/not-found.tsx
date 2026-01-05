import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <h2 className="text-xl font-semibold mb-4">Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md max-sm:text-sm">
          Feeling lost? Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="max-sm:text-sm flex items-center justofy-center px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
      <footer className="mt-12 text-center max-sm:text-sm text-muted-foreground">
        Don&apos;t just roam around anywhere dude, stay on the track.
      </footer>
    </div>
  );
};

export default NotFoundPage;
