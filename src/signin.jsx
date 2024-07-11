import React, { useEffect } from 'react';

const GoogleSignIn = () => {
    useEffect(() => {
        const initializeGoogleSignIn = () => {
            window.google.accounts.id.initialize({
                client_id: '285103588292-h521q4au7g1vvdtjbrsrqsti420jdq9g.apps.googleusercontent.com',
                callback: handleCredentialResponse
            });
            window.google.accounts.id.renderButton(
                document.getElementById('buttonDiv'),
                { theme: 'outline', size: 'large' }
            );
            window.google.accounts.id.prompt();
        };

        const handleCredentialResponse = (response) => {
            console.log("Encoded JWT ID token:" + response.credential);
        };
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        document.body.appendChild(script);
    }, []);

    return (
        <div>
            <h2>Sign in with Google</h2>
            <div id="buttonDiv"></div>
        </div>
    );
};

export default GoogleSignIn;