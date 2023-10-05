import { Grid, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel } from "@mui/material";
import TenantRegistrationForm from "../../../components/registration-form/tenant";
import { useState } from "react";
import LandlordRegistrationForm from "../../../components/registration-form/landlord";

interface Props {
    onRegistered: () => void;
}

enum RegistrationType {
    Tenant = 'tenant',
    Landlord = 'landlord',
}

const Register = ({ onRegistered }: Props) => {
    const [registrationType, setRegistrationType] = useState(RegistrationType.Tenant);

    return (
        <Grid>
            <FormControl>
                <FormLabel id="signup-type-label">I am signing up as</FormLabel>
                <RadioGroup
                    aria-labelledby="signup-type-label"
                    value={registrationType}
                    onChange={(e) => {
                        console.log('debug::target::value::', e.target.value);
                        setRegistrationType(e.target.value as RegistrationType)
                    }}
                    name="registration-type-radio-buttons"
                >
                    <FormControlLabel value={RegistrationType.Tenant} control={<Radio />} label="Tenant" />
                    <FormControlLabel value={RegistrationType.Landlord} control={<Radio />} label="Lanlord" />
                </RadioGroup>
            </FormControl>
            {
                registrationType === RegistrationType.Tenant && <TenantRegistrationForm onRegistered={onRegistered} />
            }
            {
                registrationType === RegistrationType.Landlord && <LandlordRegistrationForm onRegistered={onRegistered} />
            }
        </Grid>
    );
}

export default Register;