import { LayoutDashboard, Users } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

import { cn } from '@/lib/utils';

const links = [
	{ to: '/', label: 'Главная', icon: LayoutDashboard },
	{ to: '/registry', label: 'Картотека', icon: Users },
];

export default function Layout() {
	return (
		<div className='flex h-screen'>
			<aside className='flex w-60 shrink-0 flex-col gap-1 bg-neutral-900 p-3 text-neutral-100'>
				<div className='px-3 py-4 text-lg font-semibold'>Картотека граждан</div>
				{links.map(({ to, label, icon: Icon }) => (
					<NavLink
						key={to}
						className={({ isActive }) =>
							cn(
								'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
								isActive
									? 'bg-neutral-800 text-white'
									: 'text-neutral-400 hover:bg-neutral-800/60 hover:text-white',
							)
						}
						end={to === '/'}
						to={to}
					>
						<Icon className='size-4' />
						{label}
					</NavLink>
				))}
			</aside>
			<main className='flex min-w-0 flex-1 flex-col overflow-hidden'>
				<Outlet />
			</main>
		</div>
	);
}
