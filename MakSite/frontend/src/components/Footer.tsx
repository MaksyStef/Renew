import type { JSX } from 'react'
import { Link } from 'react-router-dom';

export default function Footer(props: any): JSX.Element {
  return (
    <footer {...props} className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; 2026 MakSite. All rights reserved.</p>
      </div>
    </footer>
  );
}