import "../style/QnaAddPage.scss";
import BasicMenu from "../../common/components/BasicMenu";
import QnaAddComponent from "../component/QnaAddComponent";

const QnaBoardAddPage = () => {
	return (
		<div>
			<BasicMenu />
			<div className="add-page">
				<QnaAddComponent />
			</div>
		</div>
	);
};

export default QnaBoardAddPage;
