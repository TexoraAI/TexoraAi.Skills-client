/**
 * iconRegistry.js
 * Maps string icon names (stored in CMS data) to Lucide React components.
 * Add new icons here as needed.
 */

import {
    Zap, BookOpen, Award, Users, Video, ClipboardList,
    BarChart2, FolderOpen, Star, TrendingUp, UserCheck,
    Layers, Settings, Shield, Home, Mail, Phone, Globe,
    ChevronRight, ChevronDown, Edit, Trash2, Eye, EyeOff,
    Plus, GripVertical, Check, X, Upload, Download,
    AlertCircle, Info, CheckCircle, FileText, Image,
  } from "lucide-react";
  
  const iconMap = {
    Zap, BookOpen, Award, Users, Video, ClipboardList,
    BarChart2, FolderOpen, Star, TrendingUp, UserCheck,
    Layers, Settings, Shield, Home, Mail, Phone, Globe,
    ChevronRight, ChevronDown, Edit, Trash2, Eye, EyeOff,
    Plus, GripVertical, Check, X, Upload, Download,
    AlertCircle, Info, CheckCircle, FileText, Image,
  };
  
  export const getIcon = (name, fallback = Star) => iconMap[name] || fallback;
  
  export default iconMap;