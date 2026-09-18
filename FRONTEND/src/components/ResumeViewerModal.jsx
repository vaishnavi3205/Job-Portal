import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { 
    FileText, 
    ExternalLink, 
    Download, 
    AlertCircle, 
    Loader2, 
    Maximize2, 
    Eye, 
    CheckCircle2, 
    GraduationCap, 
    Mail, 
    Phone, 
    Globe, 
    Briefcase,
    BookOpen
} from 'lucide-react';
import { resolveFileUrl } from '@/utils/constants';

const ResumeViewerModal = ({ open, setOpen, resumeUrl, resumeTitle = "Candidate_Resume.pdf", candidateName, candidateProfile }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('pdf'); // 'pdf' or 'document'
    const safeUrl = resolveFileUrl(resumeUrl);

    useEffect(() => {
        if (open) {
            setIsLoading(true);
            // Ensure the loading overlay doesn't hang if the browser's PDF plugin suppresses iframe load events
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [open, safeUrl]);

    const handleOpenInNewTab = () => {
        if (safeUrl) {
            window.open(safeUrl, '_blank', 'noopener,noreferrer');
        }
    };

    const skills = candidateProfile?.skills || [];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] md:w-[85vw] max-h-[94vh] flex flex-col p-0 overflow-hidden rounded-2xl border border-slate-200 shadow-2xl bg-white">
                {/* Header */}
                <DialogHeader className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/80 flex flex-row items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                            <DialogTitle className="text-sm sm:text-base font-bold text-slate-900 truncate">
                                {resumeTitle}
                            </DialogTitle>
                            <p className="text-[11px] text-slate-500 truncate">
                                {candidateName ? `Resume of ${candidateName}` : "Candidate Resume"} • PDF Document
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {/* View Switcher Tabs */}
                        <div className="hidden sm:flex items-center bg-slate-200/70 p-0.5 rounded-lg text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => setViewMode('pdf')}
                                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${viewMode === 'pdf' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                PDF File
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('document')}
                                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${viewMode === 'document' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                Summary CV
                            </button>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleOpenInNewTab}
                            className="h-8 text-xs font-medium border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 gap-1.5 cursor-pointer"
                            title="Open original PDF in browser tab"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Open in Tab</span>
                        </Button>

                        <a
                            href={safeUrl}
                            download={resumeTitle}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
                            title="Download PDF"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Download</span>
                        </a>
                    </div>
                </DialogHeader>

                {/* Main Viewer Body */}
                <div className="flex-1 w-full relative bg-slate-100/60 min-h-[60vh] max-h-[76vh] overflow-auto flex flex-col">
                    {viewMode === 'pdf' ? (
                        <div className="w-full h-full min-h-[65vh] relative flex-1 flex flex-col bg-slate-50">
                            {isLoading && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/90 gap-2 text-slate-500">
                                    <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
                                    <span className="text-xs font-medium">Preparing document view...</span>
                                </div>
                            )}

                            {safeUrl ? (
                                <object
                                    data={`${safeUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                                    type="application/pdf"
                                    className="w-full h-full min-h-[65vh] flex-1 bg-white border-0"
                                >
                                    <iframe
                                        src={`${safeUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                                        title={resumeTitle}
                                        className="w-full h-full min-h-[65vh] border-0 bg-white"
                                        onLoad={() => setIsLoading(false)}
                                    />
                                </object>
                            ) : (
                                <div className="text-center p-8 max-w-sm mx-auto my-auto space-y-3">
                                    <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-800">No Resume File Available</h4>
                                    <p className="text-xs text-slate-500">
                                        No active resume document could be located for this account.
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Clean Formatted Document View */
                        <div className="p-6 sm:p-8 max-w-3xl mx-auto w-full my-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in-50">
                            {/* Candidate Header */}
                            <div className="border-b border-slate-100 pb-5">
                                <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                                    {candidateName || "Candidate"}
                                </h2>
                                <p className="text-xs sm:text-sm font-semibold text-indigo-600 mt-1">
                                    {candidateProfile?.headline || (candidateProfile?.degree ? `${candidateProfile.degree} Student` : "Computer Science & Engineering")}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                                    {candidateProfile?.college && (
                                        <span className="flex items-center gap-1.5">
                                            <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                                            {candidateProfile.college}
                                        </span>
                                    )}
                                    {candidateProfile?.github && (
                                        <a href={candidateProfile.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-indigo-600 hover:underline">
                                            <Globe className="w-3.5 h-3.5" /> GitHub Profile
                                        </a>
                                    )}
                                    {candidateProfile?.linkedin && (
                                        <a href={candidateProfile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-indigo-600 hover:underline">
                                            <Globe className="w-3.5 h-3.5" /> LinkedIn Profile
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Summary */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Professional Summary</h3>
                                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                    {candidateProfile?.bio || "Passionate and motivated engineering student with solid foundations in frontend web technologies, React.js, and modern full-stack development. Eager to solve real-world problems and deliver intuitive user experiences."}
                                </p>
                            </div>

                            {/* Education */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Education Background</h3>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                                                {candidateProfile?.college || "SVERI College of Engineering"}
                                            </h4>
                                            <p className="text-xs text-slate-500">
                                                {candidateProfile?.degree || "B.Tech in Computer Science and Engineering"}
                                            </p>
                                        </div>
                                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                            Class of {candidateProfile?.graduationYear || "2027"}
                                        </span>
                                    </div>
                                    {candidateProfile?.cgpa && (
                                        <p className="text-[11px] font-semibold text-slate-600 mt-2">
                                            Cumulative CGPA: <span className="text-indigo-600">{candidateProfile.cgpa} / 10.0</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Skills */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Technical Skills</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {(skills.length > 0 ? skills : ["React.js", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Git"]).map((skill, index) => (
                                        <span key={index} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Projects */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Featured Projects</h3>
                                <div className="space-y-3">
                                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white">
                                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">Career & Job Portal Platform</h4>
                                        <p className="text-xs text-slate-600 mt-1">
                                            Comprehensive recruitment platform built with React, Redux Toolkit, Node.js, and MongoDB featuring real-time candidate application workflows and instant resume previews.
                                        </p>
                                    </div>
                                    <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white">
                                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">Interactive Frontend Web Applications</h4>
                                        <p className="text-xs text-slate-600 mt-1">
                                            Designed modular responsive components with Tailwind CSS and modern state architectures.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5">
                            <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
                            Click "Open in Tab" for full browser zoom, search, and printing tools.
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpen(false)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 h-7 px-2.5 cursor-pointer"
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ResumeViewerModal;
