import { Button, IconButton } from "@mui/material";
import SearchBar from "../search-bar";
import styled from "@emotion/styled";
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from "react-router-dom";
import Logo from "../logo";

const Root = styled.div`
    display: flex;
    padding: 10px;
    flex-wrap: nowrap;
    background-color: #ececec;
    .column {
        flex: 1;
        display: flex;
        align-items: center;
        &:last-child {
            flex-direction: row-reverse;
        }
    }
`

const NavBar = () => {
    const navigate = useNavigate();
    return (
        <Root>
            <div className="column" >
                <Logo />
            </div>
            <div className="column" >
                <SearchBar />
            </div>
            <div className="column" >
                <IconButton onClick={() => navigate('/auth')}>
                    <AccountCircle />
                </IconButton>
            </div>
        </Root>
    )
};

export default NavBar;