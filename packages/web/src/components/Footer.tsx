export function Footer() {
  return (
    <footer className="border-t border-border-primary px-6 py-8 text-center">
      <p className="text-gray-500 text-sm">
        by{" "}
        <a
          href="https://gustycube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors"
        >
          GustyCube
        </a>
      </p>
      <div className="flex gap-4 justify-center mt-3">
        <a
          href="https://gustycube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-white text-sm transition-colors"
        >
          Website
        </a>
        <a
          href="https://github.com/gustycube"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-white text-sm transition-colors"
        >
          GitHub
        </a>
        <a
          href="https://x.com/gustycube"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-white text-sm transition-colors"
        >
          X
        </a>
      </div>
    </footer>
  );
}
