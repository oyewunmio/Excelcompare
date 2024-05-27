import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import Login from '../components/Login';
import Modal from 'react-modal';

interface ComparePageProps {
    token: string | null;
    setToken: (token: string, username: string) => void;
}

// Make sure to initialize the modal's root element
Modal.setAppElement('#root');

const ComparePage: React.FC<ComparePageProps> = ({ token, setToken }) => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [shouldCompare, setShouldCompare] = useState(false);

    useEffect(() => {
        if (!token) {
            setIsLoginModalOpen(true);
        }
    }, [token]);

    const handleCompareClick = () => {
        if (!token) {
            setIsLoginModalOpen(true);
        } else {
            setShouldCompare(true);
        }
    };

    const handleLoginSuccess = (token: string, username: string) => {
        setToken(token, username);
        setIsLoginModalOpen(false);
        setShouldCompare(true);
    };

    return (
        <div>
            <div className="container mx-auto p-4">
                <FileUpload token={token} shouldCompare={shouldCompare} />
            </div>
            <Modal
                isOpen={isLoginModalOpen}
                onRequestClose={() => { }}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                contentLabel="Login"
                className="Modal"
                overlayClassName="Overlay"
            >
                <Login setToken={handleLoginSuccess} />
            </Modal>
        </div>
    );
};

export default ComparePage;
