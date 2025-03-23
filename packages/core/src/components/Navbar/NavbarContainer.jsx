import Navbar from './Navbar';
import { Box } from "@mui/joy";



export default function NavbarContainer({children}){
  return <>
    <Navbar /> 
    <Box component="main" sx={{ 
      pt: '40px',
      display: 'flex',
    }}>
      <Box sx={{ 
        flex: 1,
        px:{xs:1,sm:1.5},
        pt:0.5,
        pb:0,
        minWidth: 0
      }}>
        {children}
      </Box>
    </Box>
  </>
}