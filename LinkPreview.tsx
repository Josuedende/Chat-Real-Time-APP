import React from 'react';

interface LinkPreviewProps {
  url: string;
  title: string;
  description: string;
  image: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url, title, description, image }) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="mt-2 block bg-black/30 rounded-lg overflow-hidden max-w-sm hover:bg-black/50 transition-colors">
      <div className="flex">
        {image && <img src={image} alt={title} className="w-24 h-24 object-cover" />}
        <div className="p-2 flex-1">
          <h4 className="font-bold text-sm text-white truncate">{title}</h4>
          <p className="text-xs text-gray-300 line-clamp-2">{description}</p>
          <span className="text-xs text-gray-500 truncate block mt-1">{url}</span>
        </div>
      </div>
    </a>
  );
};

export default LinkPreview;