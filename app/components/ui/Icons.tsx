import React from 'react';
import { IconBaseProps } from 'react-icons';
import {
  LuScale,
  LuFileText,
  LuEye,
  LuPencil,
  LuCheck,
  LuCircleCheck,
  LuArrowLeft,
  LuArrowRight,
  LuPlus,
  LuTrash2,
  LuRotateCcw,
  LuGlobe,
  LuPrinter,
  LuDownload,
  LuCalendar,
  LuMenu,
  LuX,
  LuCircleAlert,
  LuTriangleAlert,
  LuSparkles,
  LuLoaderCircle,
} from 'react-icons/lu';

export interface IconProps extends IconBaseProps {
  size?: number | string;
  className?: string;
}

export const Icons = {
  // Justice Scales (Legal logo)
  Scales: (props: IconProps) => <LuScale {...props} />,

  // Document / Petition
  FileText: (props: IconProps) => <LuFileText {...props} />,

  // Eye / Preview
  Eye: (props: IconProps) => <LuEye {...props} />,

  // Edit / Pen
  Edit: (props: IconProps) => <LuPencil {...props} />,

  // Check / Success
  Check: (props: IconProps) => <LuCheck {...props} />,

  // CheckCircle
  CheckCircle: (props: IconProps) => <LuCircleCheck {...props} />,

  // Navigation Arrows
  ArrowLeft: (props: IconProps) => <LuArrowLeft {...props} />,
  ArrowRight: (props: IconProps) => <LuArrowRight {...props} />,

  // Add / Plus
  Plus: (props: IconProps) => <LuPlus {...props} />,

  // Trash / Delete
  Trash: (props: IconProps) => <LuTrash2 {...props} />,

  // Reset / Refresh
  RotateCcw: (props: IconProps) => <LuRotateCcw {...props} />,

  // Globe / Language
  Globe: (props: IconProps) => <LuGlobe {...props} />,

  // Print
  Printer: (props: IconProps) => <LuPrinter {...props} />,

  // Download
  Download: (props: IconProps) => <LuDownload {...props} />,

  // Calendar / Dates
  Calendar: (props: IconProps) => <LuCalendar {...props} />,

  // Mobile Menu
  Menu: (props: IconProps) => <LuMenu {...props} />,

  // Close / X
  X: (props: IconProps) => <LuX {...props} />,

  // Warning & Info
  AlertCircle: (props: IconProps) => <LuCircleAlert {...props} />,
  AlertTriangle: (props: IconProps) => <LuTriangleAlert {...props} />,

  // Sample data / AI / Magic
  Sparkles: (props: IconProps) => <LuSparkles {...props} />,

  // Loading spinner
  Spinner: ({ className = '', ...props }: IconProps) => (
    <LuLoaderCircle className={`animate-spin ${className}`} {...props} />
  ),
};

export {
  LuScale,
  LuFileText,
  LuEye,
  LuPencil,
  LuCheck,
  LuCircleCheck,
  LuArrowLeft,
  LuArrowRight,
  LuPlus,
  LuTrash2,
  LuRotateCcw,
  LuGlobe,
  LuPrinter,
  LuDownload,
  LuCalendar,
  LuMenu,
  LuX,
  LuCircleAlert,
  LuTriangleAlert,
  LuSparkles,
  LuLoaderCircle,
};
