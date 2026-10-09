import {
  CalendarCheck,
  Clock,
  FileText,
  LayoutDashboard,
  Receipt,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  titleKey: string;
  href: string;
  icon: LucideIcon;
}

export const adminNav: NavItem[] = [
  { titleKey: "nav.dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { titleKey: "nav.employees", href: "/admin/employees", icon: Users },
  { titleKey: "nav.attendance", href: "/admin/attendance", icon: CalendarCheck },
  { titleKey: "nav.payroll", href: "/admin/payroll", icon: Wallet },
];

export const userNav: NavItem[] = [
  { titleKey: "nav.dashboard", href: "/user/dashboard", icon: LayoutDashboard },
  { titleKey: "nav.attendance", href: "/user/attendance", icon: Clock },
  { titleKey: "nav.requests", href: "/user/requests", icon: FileText },
  { titleKey: "nav.payslips", href: "/user/payslips", icon: Receipt },
];

export const accountNav: NavItem[] = [
  { titleKey: "nav.profile", href: "/profile", icon: UserRound },
];
