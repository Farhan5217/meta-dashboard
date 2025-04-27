// // components/dashboard/CreativeThumbnails.tsx
// import React, { useState } from "react";
// import { ChevronLeft, ChevronRight, Play } from "lucide-react";
// import { VideoPlayerModal } from "../../components/creatives/VideoPlayerModal";
// import type { CreativeItem } from "@/types/api";

// interface CreativeThumbnailsProps {
//   creatives: CreativeItem[];
//   itemsPerPage?: number;
// }

// export const CreativeThumbnails: React.FC<CreativeThumbnailsProps> = ({
//   creatives,
//   itemsPerPage = 2,
// }) => {
//   const [currentPage, setCurrentPage] = useState(0);
//   const [selectedVideo, setSelectedVideo] = useState<CreativeItem | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // No creatives to display
//   if (!creatives || creatives.length === 0) {
//     return <div className="text-gray-500 text-center">No creatives available</div>;
//   }

//   // Calculate pagination
//   const totalPages = Math.ceil(creatives.length / itemsPerPage);
//   const startIndex = currentPage * itemsPerPage;
//   const visibleCreatives = creatives.slice(startIndex, startIndex + itemsPerPage);

//   const handleNextPage = () => {
//     if (currentPage < totalPages - 1) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 0) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleThumbnailClick = (creative: CreativeItem) => {
//     if (creative.video_url) {
//       setSelectedVideo(creative);
//       setIsModalOpen(true);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <div className="flex items-center space-x-2 my-1">
//         {visibleCreatives.map((creative, index) => (
//           <div
//             key={creative.creative_id}
//             className="relative group cursor-pointer"
//             onClick={() => handleThumbnailClick(creative)}
//           >
//             <div className="w-14 h-14 md:w-16 md:h-16 rounded-md bg-gray-100 overflow-hidden border border-gray-200">
//               {creative.preview_url ? (
//                 <img
//                   src={creative.preview_url}
//                   alt={creative.creative_name}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                   <span className="text-xs text-gray-500">No image</span>
//                 </div>
//               )}
              
//               {creative.video_url && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <Play className="h-5 w-5 text-white" />
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination controls */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-center mt-1 space-x-2">
//           <button
//             onClick={handlePrevPage}
//             disabled={currentPage === 0}
//             className={`p-1 rounded-full ${
//               currentPage === 0
//                 ? "text-gray-300 cursor-not-allowed"
//                 : "text-gray-600 hover:bg-gray-100"
//             }`}
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </button>
//           <span className="text-xs text-gray-500">
//             {currentPage + 1} / {totalPages}
//           </span>
//           <button
//             onClick={handleNextPage}
//             disabled={currentPage === totalPages - 1}
//             className={`p-1 rounded-full ${
//               currentPage === totalPages - 1
//                 ? "text-gray-300 cursor-not-allowed"
//                 : "text-gray-600 hover:bg-gray-100"
//             }`}
//           >
//             <ChevronRight className="h-4 w-4" />
//           </button>
//         </div>
//       )}

//       {/* Video modal */}
//       <VideoPlayerModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         videoUrl={selectedVideo?.video_url}
//         title={selectedVideo?.ad_name}
//       />
//     </div>
//   );
// };


// components/dashboard/CreativeThumbnails.tsx
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Play, Image as ImageIcon } from "lucide-react";
import { VideoPlayerModal } from "../../components/creatives/VideoPlayerModal";
import type { CreativeItem } from "@/types/api";

interface CreativeThumbnailsProps {
  creatives: CreativeItem[];
  itemsPerPage?: number;
}

export const CreativeThumbnails: React.FC<CreativeThumbnailsProps> = ({
  creatives,
  itemsPerPage = 1,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCreative, setSelectedCreative] = useState<CreativeItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // No creatives to display
  if (!creatives || creatives.length === 0) {
    return <div className="text-gray-500 text-center">No creatives available</div>;
  }

  // Calculate pagination
  const totalPages = Math.ceil(creatives.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleCreatives = creatives.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleThumbnailClick = (creative: CreativeItem) => {
    // Always allow clicking on the thumbnail, whether it has video_url or not
    setSelectedCreative(creative);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center space-x-2  mt-2">
        {visibleCreatives.map((creative, index) => (
          <div
            key={creative.creative_id}
            className="relative group cursor-pointer"
            onClick={() => handleThumbnailClick(creative)}
          >
            <div className="w-14 h-14 md:w-14 md:h-14 rounded-md bg-gray-100 overflow-hidden border border-gray-200 ">
              {creative.preview_url ? (
                <img
                  src={creative.preview_url}
                  alt={creative.creative_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-xs text-gray-500">No image</span>
                </div>
              )}
              
              {/* Show the appropriate overlay icon based on content type */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                {creative.video_url ? (
                  <Play className="h-5 w-5 text-white" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-white" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-1 space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`p-1 rounded-full ${
              currentPage === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          <span className="text-xs text-gray-500">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className={`p-1 rounded-full ${
              currentPage === totalPages - 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Video/Image modal */}
      <VideoPlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl={selectedCreative?.video_url}
        imageUrl={selectedCreative?.preview_url}  // Pass the preview URL as a fallback
        title={selectedCreative?.ad_name || selectedCreative?.creative_name}
      />
    </div>
  );
};