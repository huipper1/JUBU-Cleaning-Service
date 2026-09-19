import type { ComponentType } from "react";

import {
  ArrowLeftRight,
  ArrowRight,
  Building,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Coins,
  Facebook,
  Gem,
  HardHat,
  HeartHandshake,
  HelpCircle,
  Home,
  Instagram,
  Leaf,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  PhoneCall,
  ShieldCheck,
  Sofa,
  Sparkles,
  Star,
  Truck,
  Users,
  X,
  Youtube,
  type LucideProps
} from "lucide-react";

export const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  home: Home,
  building: Building2,
  "building-2": Building2,
  "building-office": Building,
  sparkles: Sparkles,
  sofa: Sofa,
  "hard-hat": HardHat,
  truck: Truck,
  "shield-check": ShieldCheck,
  users: Users,
  leaf: Leaf,
  clock: Clock,
  coins: Coins,
  star: Star,
  gem: Gem,
  "heart-handshake": HeartHandshake,
  "map-pin": MapPin,
  phone: Phone,
  "phone-call": PhoneCall,
  mail: Mail,
  whatsapp: MessageCircle,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  calendar: Calendar,
  lock: Lock,
  "arrow-right": ArrowRight,
  "arrow-left-right": ArrowLeftRight,
  check: Check,
  menu: Menu,
  x: X,
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  "help-circle": HelpCircle
};

export type IconName = keyof typeof ICON_MAP | string;

export interface JubuIconProps extends LucideProps {
  name: IconName;
}

export function JubuIcon({ name, ...props }: JubuIconProps) {
  const IconComponent = ICON_MAP[name.toLowerCase()] ?? HelpCircle;
  return <IconComponent {...props} />;
}
