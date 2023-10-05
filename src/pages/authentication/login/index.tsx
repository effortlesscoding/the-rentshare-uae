import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button";
import { FormEvent, useState } from "react";
import { useAppDispatch } from "../../../state/hooks";
import { loginUser } from "../../../state/users/slice";
import { trackEvent } from "../../../utils/analytics";
import { useOnMount } from "../../../utils/useOnMount";

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
            trackEvent('ui_event', {
                action: 'started',
                subject: 'login',
                extra: formValues.email,
            });
            const response = await dispatch(loginUser({
                email: formValues.email,
                password: formValues.password,
            }));
            const payload = response.payload as any;
            if (payload.user) {
                trackEvent('ui_event', {
                    action: 'succeeded',
                    subject: 'login',
                    extra: `userid_${payload.user.id}`,
                });
                onLoggedIn();
            } else if (payload.error) {
                trackEvent('ui_event', {
                    action: 'failed',
                    subject: 'login',
                    extra: `status_${payload.status}`,
                });
                alert(`${payload.error} with status ${payload.status}`)
            }
        } catch (e) {
            alert((e as any).message);
        }
    };

    useOnMount(() => {
        trackEvent('ui_event', {
            action: 'viewed',
            subject: 'login',
            extra: '',
        });
    });

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