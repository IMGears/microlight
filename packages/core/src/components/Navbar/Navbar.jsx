'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import Logo from '../Logo';
import { Box, Sheet, Button } from '@mui/joy';

export default function Navbar({ user, signOut }) {
	const pathname = usePathname();

	return (
		<Sheet
			component="nav"
			sx={{
				px: 1,
				// py: 0.5,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				// boxShadow: 'sm',
				borderBottom: '1px solid',
				borderColor: 'divider',
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				height: '40px',
				zIndex: 1000,
				bgcolor: 'background.surface',
				// bgcolor: 'white',
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
				{/* <Logo offering='Transactions' /> */}
				<Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
					<Box sx={{ fontWeight: 'bold' }}>Microlight</Box>
				</Link>

				<Box sx={{ display: 'flex', gap: 1 }}>
					<Link href="/library" style={{ textDecoration: 'none' }}>
						<Button
							variant={pathname?.startsWith('/library') ? 'solid' : 'plain'}
							size="sm"
							color="neutral"
						>
							Library
						</Button>
					</Link>

					<Link href="/monitoring" style={{ textDecoration: 'none' }}>
						<Button
							variant={pathname?.startsWith('/monitoring') ? 'solid' : 'plain'}
							size="sm"
							color="neutral"
						>
							Monitoring
						</Button>
					</Link>
				</Box>
			</Box>

		</Sheet>
	);
};

