import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useAppDispatch } from '../../state/hooks';
import { FormEvent, useState } from 'react';
import { registerUser } from '../../state/users/slice';
import { trackEvent } from '../../utils/analytics';
import { useOnMount } from '../../utils/useOnMount';

interface TenantRegistrationFormState {
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

const TenantRegistrationForm = ({
    onRegistered,
}: Props) => {
    const [formState, setFormState] = useState<TenantRegistrationFormState>({
        email: '',
        password: '',
    })
    const dispatch = useAppDispatch();
    const handleSubmit = async (evt: FormEvent) => {
        evt.preventDefault();
        evt.stopPropagation();
        try {
            trackEvent('ui_event', {
                action: 'started',
                subject: 'tenantRegistration',
                extra: formState.email,
            });
            const response = await dispatch(registerUser({
                email: formState.email,
                password: formState.password,
                extraDetails: {
                    ...formState,
                }
            }));
            const payload = response.payload as any;
            if (payload.user) {
                trackEvent('ui_event', {
                    action: 'succeeded',
                    subject: 'tenantRegistration',
                    extra: `userid_${payload.user.id}`,
                });
                // TODO: Cutting corners to wait for the state update
                setTimeout(() => {
                    onRegistered && onRegistered();
                }, 0)
            } else if (payload.error) {
                trackEvent('ui_event', {
                    action: 'failed',
                    subject: 'tenantRegistration',
                    extra: `userid_${payload.status}`,
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
            subject: 'tenantRegistration',
            extra: '',
        });
    });

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
                value={formState.email ?? null}
                onChange={(e) => setFormState(formState => ({ ...formState, email: e.target.value }))}
                required
            />
            <TextField
                label="Phone number"
                value={formState.phoneNumber ?? null}
                onChange={(e) => setFormState(formState => ({ ...formState, phoneNumber: e.target.value }))}
            />
            <TextField
                label="Password"
                type="password"
                value={formState.password ?? null}
                onChange={(e) => setFormState(formState => ({ ...formState, password: e.target.value }))}
                required
            />
            <TextField
                label="First name"
                value={formState.firstName ?? null}
                onChange={(e) => setFormState(formState => ({ ...formState, firstName: e.target.value }))}
            />
            <TextField
                label="Last name"
                value={formState.lastName ?? null}
                onChange={(e) => setFormState(formState => ({ ...formState, lastName: e.target.value }))}
            />
            <TextField
                label="About you"
                value={formState.aboutMe ?? null}
                type="text"
                multiline
                onChange={(e) => setFormState(formState => ({ ...formState, aboutMe: e.target.value }))}
                placeholder="I'm a 25 years old male, working in an office. Quiet and willing to share a room with other people."
            />
            <TextField
                label="Your weekly budget (AED)"
                type="number"
                onChange={(e) => setFormState(formState => ({ ...formState, weeklyBudget: e.target.value }))}
            />
            <Button variant="outlined" type="submit">
                Sign up as a tenant
            </Button>
        </Grid>
    )
}

export default TenantRegistrationForm;
