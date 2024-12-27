import Toast from 'react-bootstrap/Toast';

interface NotificationToastProps {
    show: boolean;
    handleClose: () => void;
    delayInSec: number | undefined;
    header: string | undefined;
    body: string;
    variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | undefined;
}

const defaultAutohide = 5000; //En caso de que 'delayInSec' sea undefined, se utiliza esta variable.

export function NotificationToast({show, handleClose, delayInSec, header, body, variant}:NotificationToastProps) {
    if (!variant) variant = 'light'; //Para no tener problemas con el operador logico del color de texto en el Toast.Body
    return (
        <Toast className="position-fixed bottom-0 end-0 m-3" style={{ zIndex: 1050 }} bg={variant} show={show} onClose={handleClose} delay={delayInSec ? delayInSec*1000 : defaultAutohide} autohide>
            {header ?
                <Toast.Header>
                    <strong className="me-auto">{header}</strong>
                </Toast.Header>
                : ""} {/* En caso de que 'header' sea undefined, solo se muestra el mensaje del Toast */}
            <Toast.Body style={variant == 'light' || variant == 'info' || variant == 'warning' ? { color: 'black' } : { color: 'white' }}>{body}</Toast.Body>
        </Toast>
    );
};