import TsunamiIcon from '@mui/icons-material/Tsunami';
import Typography from '@mui/material/Typography';
export default function FullLogo(){
    return (
        <div>
            <Typography variant="h6" sx={{
          display: 'flex',
          alignItems: 'start',
        }}>
                <TsunamiIcon/>
                HealthAxis
            </Typography>
        </div>
    )
}