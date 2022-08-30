import { Navigate } from 'react-router-dom';
import { getCookie } from 'js/cookie';

const PublicRoute = ({ restricted,children }) => {
    if(restricted && getCookie('myToken')) return <Navigate to="/home"/>
    return children;
}

export default PublicRoute;