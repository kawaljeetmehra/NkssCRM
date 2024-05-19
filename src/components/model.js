import React from "react";
import { Modal, Row } from "react-bootstrap";

const ModalComp = ({ isOpen, onClose, children }) => {
  
    return (
          <>
                <style>
                {`
                    /* Custom CSS for modal borders */
                    .modal-content {
                        border: 0px solid #3F2A3A;
                        border-radius: 40px; /* optional: to round the corners */
                    }
                `}
            </style>
                <div>
                    <Modal show={isOpen} onHide={onClose} dialogClassName="custom-modal" size="lg">
                        <Modal.Body>
                            <Row className='justify-content-center text-center'>
                                {children}
                            </Row>
                        </Modal.Body>
                    </Modal>
                </div>
                </>
    );
}

export default ModalComp;
