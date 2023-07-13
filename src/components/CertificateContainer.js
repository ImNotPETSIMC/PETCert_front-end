import { downloadPDF } from "../Utils";
import pdfIcon from "../assets/pdf-ico.svg"

const CertificateContainer = (props) => { 

    return (
      <div className='certificate-container' key={props.pdf.data} id={props.ids[0]}>
        <div className='certificate-pdf-container'>
            <div className='button-container'>
                <button id={props.ids[1]} ><img src={pdfIcon} alt="" onClick={() => downloadPDF(props.pdf.data)}/></button>
                <label htmlFor={props.ids[1]}>PDF Original</label>
            </div>
            <div className='hash-container'>
                <input id={props.ids[2]} readOnly type="text" value={props.pdf.hashPdf}/>
                <label htmlFor={props.ids[2]}>Hash Original</label>
            </div>
        </div>
        <div className='certificate-pdf-container' key={props.pdf.signedPdf} id={props.ids[3]}>
            <div className='hash-container'>
                <input id={props.ids[4]} readOnly type="text" value={props.pdf.hashSignedPdf}/>
                <label htmlFor={props.ids[4]}>Hash Assinado</label>
            </div>
            <div className='button-container'>
                <button id={props.ids[5]} ><img src={pdfIcon} alt="" onClick={ () => downloadPDF(props.pdf.signedPdf) } /></button>
                <label id={props.ids[5]} htmlFor="">PDF Assinado</label>
            </div>
        </div>
      </div>
    )
}

export default CertificateContainer;