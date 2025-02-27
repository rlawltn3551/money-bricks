import LoginComponent from "../component/LoginComponent";
import BasicMenu from "../../components/BasicMenu";
import FooterComponent from "../../components/FooterComponent";

const LoginPage = () => {
    return (
        <div>
           <BasicMenu />
           <LoginComponent />
           <FooterComponent />
        </div>
    );
};

export default LoginPage;