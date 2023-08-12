import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button";
import { FormEvent, useState } from "react";
import { useAppDispatch } from "../../../state/hooks";
import { loginUser } from "../../../state/users/slice";

interface FormProps {
    email: string;
    password: string;
}

const defaultFormProps = {
    email: '',
    password: '',
};

interface Props {
    onLoggedIn: () => void;
}

const Login = ({ onLoggedIn }: Props) => {
    const [formValues, setFormValues] = useState<FormProps>(defaultFormProps);
    const dispatch = useAppDispatch();
    const handleSubmit = async  (evt: FormEvent) => {
        evt.preventDefault();
        evt.stopPropagation();
        try {
            console.log('debug::submitting!');
            const response = await dispatch(loginUser({
                email: formValues.email,
                password: formValues.password,
            }));
            const payload = response.payload as any;
            console.log('debug::submitting!', { payload });
            if (payload.user) {
                onLoggedIn();
            } else if (payload.error) {
                alert(`${payload.error} with status ${payload.status}`)
            }
        } catch (e) {
            alert((e as any).message);
        }
    };

    return (
        <Grid
            container
            spacing={2}
            component="form"
            onSubmit={handleSubmit}
            direction="column"
            sx={{
                '& .MuiTextField-root': { m: 1 },
            }}
        >
            <TextField
                label="Email"
                required
                value={formValues.email}
                onChange={(e) => setFormValues(v => ({ ...v, email: e.target.value }))}
            />
            <TextField
                label="Password"
                type="password"
                value={formValues.password}
                onChange={(e) => setFormValues(v => ({ ...v, password: e.target.value }))}
            />
            <Button type="submit">
                Login
            </Button>
        </Grid>
    )
}

export default Login;