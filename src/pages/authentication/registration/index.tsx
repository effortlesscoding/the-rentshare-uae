import RegistrationForm from "../../../components/registration-form";

interface Props {
    onRegistered: () => void;
}

const Register = ({ onRegistered }: Props) => {
    return (
        <RegistrationForm onRegistered={onRegistered} />
    );
}

export default Register;