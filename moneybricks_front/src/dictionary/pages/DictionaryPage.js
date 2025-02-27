import React from "react";
import DictionaryComponent from "../components/DictionaryComponent";
import BasicMenu from "../../common/components/BasicMenu";
import "../styles/DictionaryPage.scss"
import FooterComponent from "../../common/components/FooterComponent";

const DictionaryPage = () => {
    return (
        <div>
            <BasicMenu/>
            <DictionaryComponent />
           <FooterComponent />
        </div>
    );
};

export default DictionaryPage;