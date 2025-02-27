import React from 'react';
import MoneynewsComponent from "../component/MoneynewsComponent";
import BasicMenu from "../../common/components/BasicMenu";
import FooterComponent from "../../common/components/FooterComponent";

function MoneynewsPage() {
    return (
        <div>
           <BasicMenu />
           <MoneynewsComponent />
           <FooterComponent />
        </div>
    );
}

export default MoneynewsPage;