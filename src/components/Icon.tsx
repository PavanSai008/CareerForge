import type { CSSProperties } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  BarChart3,
  BrainCircuit,
  Building2,
  CheckCircle,
  ClipboardList,
  Code2,
  ExternalLink,
  Eye,
  EyeOff,
  GitBranch,
  GraduationCap,
  HelpCircle,
  Key,
  LayoutTemplate,
  Lightbulb,
  type LucideProps,
  Map,
  MessageSquareQuote,
  Play,
  Printer,
  Radar,
  RotateCcw,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
  Zap,
} from "lucide-react";

const ICONS: Record<string, React.ComponentType<LucideProps>> = {
  "alert-circle": AlertCircle,
  "alert-triangle": AlertTriangle,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  banknote: Banknote,
  "bar-chart-3": BarChart3,
  "brain-circuit": BrainCircuit,
  "building-2": Building2,
  "check-circle": CheckCircle,
  "clipboard-list": ClipboardList,
  "code-2": Code2,
  "external-link": ExternalLink,
  eye: Eye,
  "eye-off": EyeOff,
  "git-branch": GitBranch,
  "graduation-cap": GraduationCap,
  "help-circle": HelpCircle,
  key: Key,
  "layout-template": LayoutTemplate,
  lightbulb: Lightbulb,
  map: Map,
  "message-square-quote": MessageSquareQuote,
  play: Play,
  printer: Printer,
  radar: Radar,
  "rotate-ccw": RotateCcw,
  route: Route,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  star: Star,
  users: Users,
  x: X,
  zap: Zap,
};

interface IconProps {
  icon: string;
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

export default function Icon({
  icon,
  size = 16,
  color,
  className = "",
  style = {},
}: IconProps) {
  const name = icon.replace(/^lucide:/, "");
  const Component = ICONS[name];
  if (!Component) return null;

  const resolvedColor = color ?? "currentColor";

  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: resolvedColor,
        lineHeight: 0,
        ...style,
      }}
    >
      <Component size={size} color={resolvedColor} strokeWidth={2} />
    </span>
  );
}
