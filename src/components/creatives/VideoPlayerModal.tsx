// import React from "react";
// import { X } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { s } from "node_modules/framer-motion/dist/types.d-6pKw1mTI";

// interface VideoPlayerModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   videoUrl?: string;
//   title?: string;
// }

// export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
//   isOpen,
//   onClose,
//   videoUrl,
//   title,
// }) => {
//   if (!videoUrl) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-2xl">
//         <DialogHeader className="flex flex-row items-center justify-between">
//           <DialogTitle className="text-lg font-medium">{title || "Video Preview"}</DialogTitle>
//           <button
//             onClick={onClose}
//             className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </DialogHeader>
//         <div className="relative w-full pt-[56.25%]">
//           <video
//             src={videoUrl}
//             controls
//             autoPlay
//             className="absolute top-0 left-0 w-full h-full rounded-md"
//           />
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// components/ui/VideoPlayerModal.tsx
import React from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  imageUrl?: string;  // Added imageUrl for fallback
  title?: string;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  imageUrl,
  title,
}) => {
  // Check if we have either video or image URL
  if (!videoUrl && !imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-medium">{title || "Creative Preview"}</DialogTitle>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            
          </button>
        </DialogHeader>
        <div className="relative w-full">
          {videoUrl ? (
            // If video URL is available, show the video player
            <div className="relative w-full pt-[56.25%]">
              <video
                src={videoUrl}
                controls
                autoPlay
                className="absolute top-0 left-0 w-full h-full rounded-md"
              />
            </div>
          ) : imageUrl ? (
            // If only image URL is available, show the image
            <div className="flex justify-center">
              <img
                src={imageUrl}
                alt={title || "Creative Preview"}
                className="max-h-[70vh] rounded-md object-contain"
              />
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};