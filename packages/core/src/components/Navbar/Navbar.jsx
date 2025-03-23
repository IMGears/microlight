'use client';
// import Logo from '../Logo';
import { Box, Sheet,  } from '@mui/joy';
export default function Navbar({ user, signOut }) {
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
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
				{/* <Logo offering='Transactions' /> */}
				Microlight
			</Box>

		</Sheet>
	);
};

