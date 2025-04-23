import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const ContributorRoute = ({ children }) => {
  const { isSignedIn, isContributor, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    toast.error('Please login to access this page');
    return <Navigate to="/blog/login" />;
  }

  if (!isContributor) {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/blog" />;
  }

  return children;
};

export default ContributorRoute;