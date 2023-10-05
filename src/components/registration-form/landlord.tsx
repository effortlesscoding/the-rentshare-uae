import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useAppDispatch } from '../../state/hooks';
import React, { FormEvent, useState } from 'react';
import { registerUser } from '../../state/users/slice';
import { trackEvent } from '../../utils/analytics';
import { useOnMount } from '../../utils/useOnMount';

interface LandlordRegistrationFormState {
    email: string;
    password: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    // property
    propertyAddress?: string;
    totalBedrooms?: number;
    totalBathrooms?: number;
    parking?: string;
    internet?: string;
    currentTenants?: string;
    // Billing
    weeklyRent?: number;
    bondDeposit?: number;
    dewa?: string;
    dateAvailable?: string;
    minStay?: string;
    maxStay?: string;
}

interface Props {
    onRegistered: () => void;
}

enum Steps {
    PersonalInfo = 0,
    PropertyDetails =  1,
    Billing =  2,
}

const LandlordRegistrationForm = ({
    onRegistered,
}: Props) => {
    const [step, setStep] = useState<Steps>(Steps.PersonalInfo);
    const [formState, setFormState] = useState<LandlordRegistrationFormState>({
        email: '',
        password: '',
    })
    const dispatch = useAppDispatch();
    const handleSubmit = async (evt: FormEvent) => {
        evt.preventDefault();
        evt.stopPropagation();
        if (step !== Steps.Billing) {
            return false;
        }
        try {
            trackEvent('ui_event', {
                action: 'started',
                subject: 'landlordRegistration',
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
                    subject: 'landlordRegistration',
                    extra: `userid_${payload.user.id}`,
                });
                // TODO: Cutting corners to wait for the state update
                setTimeout(() => {
                    onRegistered && onRegistered();
                }, 0)
            } else if (payload.error) {
                trackEvent('ui_event', {
                    action: 'failed',
                    subject: 'landlordRegistration',
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
            subject: 'landlordRegistration',
            extra: '',
        });
    });

    const onNext = () => {
        if (step !== Steps.Billing) {
            const nextStep = step + 1;
            trackEvent('ui_event', {
                action: 'clicked',
                subject: 'landlordRegistrationNextStep',
                extra: JSON.stringify({ ...formState, step }),
            });
            setStep(nextStep);
        }
    };

    const onPrevious = () => {
        trackEvent('ui_event', {
            action: 'clicked',
            subject: 'landlordRegistrationPreviousStep',
            extra: JSON.stringify({ ...formState, step }),
        });
        setStep((step) => Math.min(step - 1, Steps.PersonalInfo));
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
            <React.Fragment>
                <Grid container direction="column" style={{ display: step === Steps.PersonalInfo ? undefined : 'none'}} >
                    <h2>Your information for registration</h2>
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
                </Grid>
                <Grid container direction="column" style={{ display: step === Steps.PropertyDetails ? undefined : 'none'}}>
                    <h2>About the property (1/2)</h2>
                    <p>You can skip this step, if you don't have this information on hand.</p>
                    <TextField
                        label="Property address"
                        type="text"
                        value={formState.propertyAddress ?? null}
                        onChange={(e) => setFormState(formState => ({ ...formState, propertyAddress: e.target.value }))}
                    />
                    <TextField
                        label="Bedrooms #"
                        type="number"
                        value={formState.totalBedrooms ?? null}
                        onChange={(e) => setFormState(formState => ({ ...formState, totalBedrooms: Number(e.target.value) }))}
                    />
                    <TextField
                        label="Bathrooms #"
                        type="number"
                        value={formState.totalBathrooms ?? null}
                        onChange={(e) => setFormState(formState => ({ ...formState, totalBathrooms: Number(e.target.value) }))}
                    />
                    <TextField
                        label="Parking availability"
                        value={formState.parking ?? null}
                        onChange={(e) => setFormState(formState => ({ ...formState, parking: e.target.value }))}
                    />
                    <TextField
                        label="Internet (included, not included, etc.)"
                        value={formState.internet ?? null}
                        onChange={(e) => setFormState(formState => ({ ...formState, internet: e.target.value }))}
                    />
                    <TextField
                        label="How many people currently live in the property?"
                        type="number"
                        value={formState.currentTenants ?? null}
                        onChange={(e) => setFormState(formState => ({ ...formState, currentTenants: e.target.value }))}
                    />
                </Grid>
                <Grid container direction="column" style={{ display: step === Steps.Billing ? undefined : 'none'}}>
                    <h2>About the property (2/2)</h2>
                    <p>You can skip this step, if you don't have this information on hand.</p>
                    <TextField
                        label="Weekly rent (AED)"
                        type="number"
                        value={formState.weeklyRent ?? null}
                        onChange={(e) => setFormState(formState => ({ ...formState, weeklyRent: Number(e.target.value) }))}
                    />
                    <TextField
                        label="Security deposit (AED)"
                        type="number"
                        value={formState.bondDeposit ?? null}
                        onChange={(e) => setFormState(formState => ({ ...formState, bondDeposit: Number(e.target.value) }))}
                    />
                    <TextField
                        label="Dewa included? (yes/no)"
                        value={formState.dewa ?? null}
                        onChange={(e) => setFormState(formState => ({ ...formState, dewa: e.target.value }))}
                    />
                    <TextField
                        label="Date available"
                        type="string"
                        value={formState.dateAvailable ?? null}
                        onChange={(e) => setFormState(formState => ({ ...formState, dateAvailable: e.target.value }))}
                    />
                    <TextField
                        label="Min length of stay."
                        value={formState.minStay ?? null}
                        onChange={(e) => setFormState(formState => ({ ...formState, minStay: e.target.value }))}
                        placeholder='ex. Min 5 weeks'
                    />
                    <TextField
                        label="Max length of stay."
                        value={formState.maxStay ?? null}
                        onChange={(e) => setFormState(formState => ({ ...formState, maxStay: e.target.value }))}
                        placeholder='ex. 6 months'
                    />
                </Grid>
                <Grid container justifyContent="space-between" style={{ marginTop: 8 }}>
                    {
                        step > Steps.PersonalInfo ? (
                            <Button variant="outlined" onClick={onPrevious}>
                                Back
                            </Button>
                        ) : <span />
                    }
                    <Button variant="outlined" type={step === Steps.Billing ? 'submit' : 'button'} onClick={step === Steps.Billing ? undefined : onNext}>
                        Next
                    </Button>
                </Grid>
            </React.Fragment>
        </Grid>
    )
}

export default LandlordRegistrationForm;
