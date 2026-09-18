import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { ExternalLink, Download, X, User, Sparkles } from 'lucide-react';
import { resolveFileUrl } from '@/utils/constants';

const ImageViewerModal = ({ open, setOpen, imageUrl, title = "Profile Photo", subtitle = "Candidate Profile Picture" }) => {
    const safeUrl = resolveFileUrl(imageUrl);

    const handleOpenInNewTab = () => {
        if (safeUrl) {
            window.open(safeUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl w-[92vw] sm:w-[85vw] p-0 overflow-hidden rounded-3xl border border-slate-200/80 shadow-2xl bg-white/95 backdrop-blur-xl">
                {/* Header */}
                <DialogHeader className="px-6 py-4 border-b border-slate-100 flex flex-row items-center justify-between gap-3 bg-slate-50/70 shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                            <DialogTitle className="text-base font-bold text-slate-900 truncate">
                                {title}
                            </DialogTitle>
                            <p className="text-xs text-slate-500 truncate flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-indigo-500" />
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleOpenInNewTab}
                            className="h-8 text-xs font-medium border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 gap-1.5 cursor-pointer"
                            title="Open original image in new tab"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Open Full Size</span>
                        </Button>

                        <a
                            href={safeUrl}
                            download={title.replace(/\s+/g, "_") + ".jpg"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
                            title="Download Image"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Save</span>
                        </a>
                    </div>
                </DialogHeader>

                {/* Main Image Body */}
                <div className="relative p-6 sm:p-8 flex items-center justify-center bg-radial from-slate-100/80 via-slate-50 to-white min-h-[340px] max-h-[70vh] overflow-auto">
                    {safeUrl ? (
                        <div className="relative group max-w-full max-h-full flex items-center justify-center">
                            <img
                                src={safeUrl}
                                alt={title}
                                className="max-h-[60vh] max-w-full w-auto h-auto object-contain rounded-2xl shadow-xl border border-slate-200/80 transition-transform duration-300 group-hover:scale-[1.01]"
                            />
                        </div>
                    ) : (
                        <div className="text-center p-8 text-slate-400">
                            <User className="w-16 h-16 mx-auto mb-2 opacity-40" />
                            <p className="text-sm font-medium">No profile photo available</p>
                        </div>
                    )}
                </div>

                {/* Footer Note */}
                <div className="px-6 py-2.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>High resolution profile picture</span>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ImageViewerModal;
