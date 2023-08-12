import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useAppDispatch } from '../../state/hooks';
import { FormEvent, useState } from 'react';
import { registerUser } from '../../state/users/slice';

interface RegistrationFormState {
    email: string;
    password: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    aboutMe?: string;
    weeklyBudget?: string;
}

interface Props {
    onRegistered: () => void;
}

const RegistrationForm = ({
    onRegistered,
}: Props) => {
    const [formState, setFormState] = useState<RegistrationFormState>({
        email: '',
        password: '',
    })
    const dispatch = useAppDispatch();
    const handleSubmit = async (evt: FormEvent) => {
        evt.preventDefault();
        evt.stopPropagation();
        console.log('debug::handleSubmit::');
        try {
            const response = await dispatch(registerUser({
                email: formState.email,
                password: formState.password,
                extraDetails: {
                    ...formState,
                }
            }));
            const payload = response.payload as any;
            console.log('debug::submitting!', { payload });
            if (payload.user) {
                // TODO: Cutting corners to wait for the state update
                setTimeout(() => {
                    onRegistered && onRegistered();
                }, 0)
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
            component="form"
            onSubmit={handleSubmit}
            direction="column"
            sx={{
                '& .MuiTextField-root': { m: 1 },
            }}
        >
            <TextField
                label="Email"
                onChange={(e) => setFormState(formState => ({ ...formState, email: e.target.value }))}
                required
            />
            <TextField
                label="Phone number"
                onChange={(e) => setFormState(formState => ({ ...formState, phoneNumber: e.target.value }))}
            />
            <TextField
                label="Password"
                type="password"
                onChange={(e) => setFormState(formState => ({ ...formState, password: e.target.value }))}
                required
            />
            <TextField
                label="First name"
                onChange={(e) => setFormState(formState => ({ ...formState, firstName: e.target.value }))}
            />
            <TextField
                label="Last name"
                onChange={(e) => setFormState(formState => ({ ...formState, lastName: e.target.value }))}
            />
            <TextField
                label="About you"
                type="text"
                multiline
                onChange={(e) => setFormState(formState => ({ ...formState, aboutMe: e.target.value }))}
            />
            <TextField
                label="Your weekly budget (AED)"
                type="number"
                onChange={(e) => setFormState(formState => ({ ...formState, weeklyBudget: e.target.value }))}
            />
            <Button type="submit">
                Create an account
            </Button>
        </Grid>
    )
}

export default RegistrationForm;
