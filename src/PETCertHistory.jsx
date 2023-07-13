import CertificateContainer from './components/CertificateContainer';
import { useEffect, useId, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firebaseDB } from './firebaseConfig';
import './styles/PETCert.css';

const PETCertHistory = () => { 
    const certificatesCollectionRef = collection(firebaseDB, 'certificates');
    const [certificates, setCertificates] = useState([]);
    const ids = [useId(), useId(), useId(), useId(), useId(), useId()];

    useEffect(() => {
        const getPDFs = async () => {
            const data = await getDocs(certificatesCollectionRef);
            setCertificates(data.docs.map((doc) => ({...doc.data(), id: doc.id })));
        };
        getPDFs();
    });

    return (
        <div className="PETCert">
            <h1>PETCERT</h1>
            <div id='inputs-container'>
                {certificates.map((certificate) => { return <CertificateContainer ids={ids} pdf={certificate}/> })}
            </div>
        </div>
    );
}

export default PETCertHistory;