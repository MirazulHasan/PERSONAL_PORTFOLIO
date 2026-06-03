import React from 'react';
import {
  Github, Linkedin, Twitter, Instagram, Facebook, Youtube, Dribbble,
  Link2, GraduationCap, Beaker, Fingerprint, BookOpen, Library, Zap,
  Layers, BarChart2, Bot, Music, MessageSquare, AtSign, PenTool, Terminal,
  Hash, PenBox, MessageCircle, Send, Briefcase, Mail
} from 'lucide-react';

interface SocialIconProps {
  platform: string;
  size?: number;
  color?: string;
}

export default function SocialIcon({ platform, size = 14, color }: SocialIconProps) {
  const p = platform.toLowerCase();
  
  if (p.includes('github')) return <Github size={size} color={color} />;
  if (p.includes('linkedin')) return <Linkedin size={size} color={color} />;
  if (p.includes('twitter') || p.includes(' x ')) return <Twitter size={size} color={color} />;
  if (p.includes('instagram')) return <Instagram size={size} color={color} />;
  if (p.includes('facebook')) return <Facebook size={size} color={color} />;
  if (p.includes('youtube')) return <Youtube size={size} color={color} />;
  if (p.includes('dribbble')) return <Dribbble size={size} color={color} />;
  
  // Professional & Academic
  if (p.includes('researchgate')) return <Beaker size={size} color={color} />;
  if (p.includes('orcid')) return <Fingerprint size={size} color={color} />;
  if (p.includes('google scholar') || p.includes('scholar')) return <GraduationCap size={size} color={color} />;
  if (p.includes('academia')) return <BookOpen size={size} color={color} />;
  if (p.includes('semantic')) return <Library size={size} color={color} />;
  if (p.includes('ieee')) return <Zap size={size} color={color} />;
  
  // Dev & Tech
  if (p.includes('stack overflow')) return <Layers size={size} color={color} />;
  if (p.includes('kaggle')) return <BarChart2 size={size} color={color} />;
  if (p.includes('huggingface')) return <Bot size={size} color={color} />;
  
  // Social
  if (p.includes('tiktok')) return <Music size={size} color={color} />;
  if (p.includes('reddit')) return <MessageSquare size={size} color={color} />;
  if (p.includes('threads')) return <AtSign size={size} color={color} />;
  
  // Blogging & Design
  if (p.includes('medium')) return <PenTool size={size} color={color} />;
  if (p.includes('dev.to')) return <Terminal size={size} color={color} />;
  if (p.includes('hashnode')) return <Hash size={size} color={color} />;
  if (p.includes('behance')) return <PenBox size={size} color={color} />;
  
  // Messaging
  if (p.includes('discord')) return <MessageCircle size={size} color={color} />;
  if (p.includes('telegram')) return <Send size={size} color={color} />;
  
  // Other
  if (p.includes('portfolio')) return <Briefcase size={size} color={color} />;
  if (p.includes('mail') || p.includes('email')) return <Mail size={size} color={color} />;
  
  return <Link2 size={size} color={color} />;
}
