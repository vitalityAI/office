import Image from 'next/image'
import Link from 'next/link'
import SiteLink from './SiteLink';


export const Footer = () => {
    return (
        <footer className="absolute bottom-0 text-white w-full pb-4 bg-navy-darkest bg-opacity-100">
            <p className='mt-4 text-center text-base'>Made with 💖 by <SiteLink href={"https://arulandu.com"} txt="Alvan Caleb Arulandu" /> {' '} <SiteLink href={"https://crucialnet.org"} txt="Rushil Umaretiya" /> for HackTJ 10.0.</p>
            <div className='flex justify-center'>
                <p>Backend: <a className='inline-block align-middle' href="https://github.com/VitalityAI/therapist">
                    <img className='h-full' src="https://img.shields.io/github/last-commit/VitalityAI/therapist" />
                </a></p>
                <p className='ml-4'>Frontend: <a className='inline-block align-middle' href="https://github.com/VitalityAI/office">
                    <img className='h-full' src="https://img.shields.io/github/last-commit/VitalityAI/office" />
                </a></p>
            </div>
        </footer>
    );
}