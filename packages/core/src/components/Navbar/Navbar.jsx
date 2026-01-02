'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Navbar({ user, signOut }) {
	const pathname = usePathname();

	return (
		<nav className="px-2 flex items-center justify-between border-b border-border fixed top-0 left-0 right-0 h-10 z-[1000] bg-background">
			<div className="flex items-center gap-4">
				<Link href="/" className="no-underline text-inherit">
					<span className="font-bold">Microlight</span>
				</Link>

				<div className="flex gap-2">
					<Link href="/library" className="no-underline">
						<Button
							variant={pathname?.startsWith('/library') ? 'default' : 'ghost'}
							size="sm"
						>
							Library
						</Button>
					</Link>

					<Link href="/monitoring" className="no-underline">
						<Button
							variant={pathname?.startsWith('/monitoring') ? 'default' : 'ghost'}
							size="sm"
						>
							Monitoring
						</Button>
					</Link>
				</div>
			</div>
		</nav>
	);
}

