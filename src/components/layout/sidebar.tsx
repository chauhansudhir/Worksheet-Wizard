import { NavLink } from 'react-router-dom'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  History,
  Calculator,
  PanelLeftClose,
  PanelLeft,
  User,
  ChevronDown,
  Gamepad2,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { sidebarCollapsedAtom } from '@/stores/ui-atoms'
import { activeProfileIdAtom, activeProfileAtom, allProfilesAtom } from '@/stores/profile-atoms'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Suspense, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getLevel } from '@/lib/levels'
import type { KidProfile } from '@/types'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/profiles', icon: Users, label: 'Profiles' },
  { to: '/create', icon: PlusCircle, label: 'New Worksheet' },
  { to: '/games', icon: Gamepad2, label: 'Math Games' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/admin', icon: Settings, label: 'Admin' },
]

function NavItem({ to, icon: Icon, label, collapsed, end }: {
  to: string; icon: typeof LayoutDashboard; label: string; collapsed: boolean; end?: boolean
}) {
  const link = (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center w-full rounded-lg transition-colors h-9 px-3 gap-3',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className={cn(
        'text-sm whitespace-nowrap transition-opacity duration-200 overflow-hidden',
        collapsed ? 'opacity-0 delay-0 w-0' : 'opacity-100 delay-150 w-auto'
      )}>{label}</span>
    </NavLink>
  )

  if (!collapsed) return link

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={4}>{label}</TooltipContent>
    </Tooltip>
  )
}

function ProfileMenu({ collapsed }: { collapsed: boolean }) {
  const activeProfileId = useAtomValue(activeProfileIdAtom)
  const activeProfile = useAtomValue(activeProfileAtom)
  const entries = useAtomValue(allProfilesAtom)
  const setActiveProfileId = useSetAtom(activeProfileIdAtom)

  const profiles = (entries ?? []).map(([, p]) => p).filter((p): p is KidProfile => p != null && !!p.name)

  // Auto-correct stale activeProfileId: if the selected profile doesn't exist,
  // pick the first available profile or clear the selection entirely
  useEffect(() => {
    if (activeProfileId && !activeProfile) {
      if (profiles.length > 0) {
        setActiveProfileId(profiles[0].id)
      } else {
        setActiveProfileId(null)
      }
    }
  }, [activeProfileId, activeProfile, profiles, setActiveProfileId])

  if (profiles.length === 0) {
    const link = (
      <Link
        to="/profiles"
        className="flex items-center w-full rounded-lg text-sm text-muted-foreground hover:bg-accent transition-colors h-10 px-3 gap-3"
      >
        <User className="h-5 w-5 shrink-0" />
        <span className={cn(
          'whitespace-nowrap transition-opacity duration-200 overflow-hidden',
          collapsed ? 'opacity-0 delay-0 w-0' : 'opacity-100 delay-150 w-auto'
        )}>Create profile</span>
      </Link>
    )

    if (!collapsed) return link

    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={4}>Create profile</TooltipContent>
      </Tooltip>
    )
  }

  // Resolve the displayed profile: use activeProfile if valid, otherwise show the first profile
  const displayProfile = activeProfile ?? profiles[0] ?? null

  if (!displayProfile) {
    // Edge case: profiles exist in list but none could be resolved — show fallback
    return (
      <Link
        to="/profiles"
        className="flex items-center w-full rounded-lg text-sm text-muted-foreground hover:bg-accent transition-colors h-10 px-3 gap-3"
      >
        <User className="h-5 w-5 shrink-0" />
        <span className={cn(
          'whitespace-nowrap transition-opacity duration-200 overflow-hidden',
          collapsed ? 'opacity-0 delay-0 w-0' : 'opacity-100 delay-150 w-auto'
        )}>Select profile</span>
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center w-full rounded-lg hover:bg-accent transition-colors text-left pr-3 gap-3 h-12"
        >
          <div
            className="h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: displayProfile.avatarColor ?? '#6b7280' }}
          >
            {displayProfile.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className={cn(
            'flex-1 min-w-0 transition-opacity duration-200 overflow-hidden',
            collapsed ? 'opacity-0 delay-0 w-0' : 'opacity-100 delay-150 w-auto'
          )}>
            <p className="text-sm font-medium truncate">{displayProfile.name ?? 'Select profile'}</p>
            <p className="text-xs text-muted-foreground truncate">
              Lv.{getLevel(displayProfile.xp ?? 0).level}
            </p>
          </div>
          <ChevronDown className={cn(
            'h-4 w-4 text-muted-foreground shrink-0 transition-opacity duration-200',
            collapsed ? 'opacity-0 delay-0 w-0' : 'opacity-100 delay-150'
          )} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={collapsed ? 'right' : 'top'} align="start" className="w-56">
        <DropdownMenuLabel>Switch Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {profiles.map((p) => (
          <DropdownMenuItem
            key={p.id}
            onClick={() => setActiveProfileId(p.id)}
            className={cn(activeProfileId === p.id && 'bg-accent')}
          >
            <div className="flex items-center gap-3">
              <div
                className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: p.avatarColor }}
              >
                {p.name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">Lv.{getLevel(p.xp ?? 0).level} &middot; {p.xp ?? 0} XP</p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profiles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Manage Profiles
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom)

  return (
    <aside
      className={cn(
        'no-print border-r bg-card flex flex-col shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-[52px]' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="border-b shrink-0 overflow-hidden h-14 flex items-center px-3 gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/" className="shrink-0">
              <Calculator className="h-6 w-6 text-primary" />
            </Link>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" sideOffset={4}>Worksheet Wizard</TooltipContent>
          )}
        </Tooltip>
        <div className={cn(
          'overflow-hidden whitespace-nowrap transition-opacity duration-200',
          collapsed ? 'opacity-0 delay-0 w-0' : 'opacity-100 delay-150 w-auto'
        )}>
          <h1 className="text-sm font-bold leading-tight">Worksheet Wizard</h1>
          <p className="text-[10px] text-muted-foreground leading-tight">Math practice made fun</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-1 overflow-hidden">
        {links.map((link) => (
          <NavItem
            key={link.to}
            to={link.to}
            icon={link.icon}
            label={link.label}
            collapsed={collapsed}
            end={link.to === '/'}
          />
        ))}
      </nav>

      {/* Profile */}
      <div className="border-t p-2 overflow-hidden">
        <Suspense fallback={<div className="h-10 w-full animate-pulse rounded bg-muted" />}>
          <ProfileMenu collapsed={collapsed} />
        </Suspense>
      </div>

      {/* Collapse toggle */}
      <div className="border-t p-2 overflow-hidden">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="h-9 w-full justify-start px-3"
            >
              {collapsed ? (
                <PanelLeft className="h-4 w-4 shrink-0" />
              ) : (
                <PanelLeftClose className="h-4 w-4 shrink-0" />
              )}
              <span className={cn(
                'text-xs whitespace-nowrap transition-opacity duration-200 overflow-hidden',
                collapsed ? 'opacity-0 delay-0 w-0' : 'opacity-100 delay-150 w-auto ml-2'
              )}>Collapse</span>
            </Button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" sideOffset={4}>Expand sidebar</TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  )
}
