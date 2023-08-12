import { Home } from "@mui/icons-material"
import { Button, IconButton } from "@mui/material"
import { useNavigate } from "react-router-dom"

const Logo = () => {
    const navigate = useNavigate()
    return (
        <Button
            onClick={() => navigate('/')}
            startIcon={<Home />}
            color="inherit"
        >
            <label>Find ShareHouses in DUBAI</label>
        </Button>
    )
}

export default Logo;