
import React from "react";
import BasicMenu from "../../common/components/BasicMenu";
import QnaListComponent from "../component/QnaListComponent";
import FooterComponent from "../../common/components/FooterComponent";

const QnaBoardListPage = () => {
	return (
		<div>
			<BasicMenu />
			<div className="list-page">
				<main className="page-main">
					<QnaListComponent />
				</main>
			</div>
			<FooterComponent />
		</div>
	);
};

export default QnaBoardListPage;
