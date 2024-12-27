import { Modal, Form, Button } from 'react-bootstrap';

interface ConfirmationModalProps {
    show: boolean;
    handleClose: () => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    question: string;
    submitButtonText: string;
    submitButtonVariant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
    cancelButtonText: string;
    cancelButtonVariant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
    moreInfo: string | undefined;
    size: "sm" | "lg" | "xl" | undefined;
}

export function ConfirmationModal({show, handleClose, handleSubmit, question, submitButtonText, submitButtonVariant, cancelButtonText, cancelButtonVariant, moreInfo, size}:ConfirmationModalProps) {
    return (
        <Modal show={show} onHide={handleClose} size={size ? size : "sm"} aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Body className='text-center'>
            <div className='h5'>
              {question}
            </div>
            {moreInfo ?
                <div>
                    {moreInfo}
                </div>
            : ""}
            <br/>
            <div>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="deleteControl">
                  <Button type='submit' variant={submitButtonVariant}>{submitButtonText}</Button>{' '}
                  <Button variant={cancelButtonVariant} onClick={handleClose}>{cancelButtonText}</Button>
                </Form.Group>
              </Form>
            </div>
          </Modal.Body>
        </Modal>
    );
}